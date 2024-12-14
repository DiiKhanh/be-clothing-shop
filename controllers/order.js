const sgMail = require("@sendgrid/mail");
const axios = require("axios");

const Order = require("../models/order");
const Customer = require("../models/customer");
const Product = require("../models/product");

const AppError = require("../util/error");
const { orderPaymentStatuses } = require("../constants");
const { printNumberWithCommas } = require("../util/printNumberWithCommas");
const io = require("../socket");

sgMail.setApiKey(process.env.SG_API_KEY);

exports.createOrder = async (req, res, next) => {
  const {
    toName,
    toPhone,
    toEmail,
    toAddress,
    toNote,
    products,
    totalProductsPrice,
    shippingPrice,
    totalPrice,
    companyName,
    companyAddress,
    companyTaxNumber,
    paymentMethod,
    customerId,
  } = req.body;

  try {
    const order = new Order({
      toName,
      toPhone,
      toEmail,
      toAddress,
      toNote,
      products,
      totalProductsPrice,
      totalPrice,
      paymentMethod,
      companyName: companyName === "" ? undefined : companyName,
      companyAddress: companyAddress === "" ? undefined : companyAddress,
      companyTaxNumber: companyTaxNumber === "" ? undefined : companyTaxNumber,
    });
    await order.save();

    const productSizes = [];

    for (const item of order.products) {
      const existingProduct = await Product.findById(item.product);
      if (existingProduct) {
        const selectedSizeIndex = existingProduct.sizes.findIndex((size) => size.name === item.size);
        existingProduct.sizes[selectedSizeIndex].sold += item.amount;
        existingProduct.totalSold += item.amount;

        productSizes.push({
          productId: existingProduct._id.toString(),
          sizes: existingProduct.sizes.map((size) => ({
            name: size.name,
            remainingQuantity: size.quantity - size.sold,
          })),
        });
        await existingProduct.save();
      }
    }

    products.forEach((product) => {
      product.price = printNumberWithCommas(product.price);
    });

    // nếu không có azure mail function nên dùng bên gửi mail khác
    const url = process.env.EMAIL_FUNC_AZURE;

      const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <p>Xin chào,</p>
        <h2 style="color: #4CAF50;">Thanh toán thành công</h2>
        <p>Vui lòng vào lịch sử mua hàng để xem chi tiết</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ hỗ trợ Clothing Shop</p>
        </div>
      `;

    const data = {
      toEmail: toEmail,
      subject: 'Đơn hàng - Clothing Shop',
      body: emailBody,
    };
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let updatedOrders;

    if (customerId) {
      const customer = await Customer.findById(customerId).populate("orders");
      if (customer) {
        updatedOrders = [...customer.orders, order];
        customer.cart = [];
        customer.orders.push(order._id);
        await customer.save();
      }
    }

    io.getIO().emit("orders", { action: "create", productSizes });

    res.status(200).json({ message: "Đặt hàng thành công", orderId: order._id, updatedOrders });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

exports.checkOutOrder = async (req, res, next) => {
  const orderId = req.body.orderId;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(404, "Không tìm thấy đơn hàng");
    }

    order.paymentStatus = orderPaymentStatuses.PAID;
    await order.save();

    res.status(200).json({ message: "Thanh toán đơn hàng thành công", cart: [] });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const orderId = req.body.orderId;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(404, "Đơn hàng không tồn tại");
    }

    const customer = await Customer.findOne({ orders: orderId });
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng của đơn hàng");
    }

    const updatedOrders = customer.orders.filter((order) => order.toString() !== orderId);
    customer.orders = updatedOrders;
    await customer.save();

    for (const product of order.products) {
      const existingProduct = await Product.findById(product.product);
      if (existingProduct) {
        const selectedSizeIndex = existingProduct.sizes.findIndex((size) => size.name === product.size);
        existingProduct.sizes[selectedSizeIndex].sold -= product.amount;
        await existingProduct.save();
      }
    }

    await Order.findByIdAndRemove(orderId);

    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("customer").populate("products.product");
    res.status(200).json({ orders });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId).populate("customer").populate("products.product");
    if (!order) {
      throw new AppError(404, "Đơn hàng không tồn tại");
    }

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const orderId = req.params.orderId;
  const { shippingStatus, paymentStatus } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError(404, "Đơn hàng không tồn tại");
    }

    order.shippingStatus = shippingStatus;
    order.paymentStatus = paymentStatus;
    await order.save();

    io.getIO().emit("orders", {
      action: "edit",
      orderId,
      orderShippingStatus: shippingStatus,
      orderPaymentStatus: paymentStatus,
    });

    res
      .status(200)
      .json({ message: "Cập nhật đơn hàng thành công", orderId: order._id.toString(), orderStatus: shippingStatus });
  } catch (error) {
    next(error);
  }
};
