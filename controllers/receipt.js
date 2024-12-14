const Product = require("../models/product");
const Receipt = require("../models/receipt");
const AppError = require("../util/error");

const io = require("../socket");

exports.importGoods = async (req, res, next) => {
  const { supplier, staff, date, deliver, products } = req.body;

  try {
    for (const product of products) {
      const existingProduct = await Product.findById(product.productId);
      if (!existingProduct) {
        throw new AppError(404, "Sản phẩm không tồn tại");
      }

      product.sizes.forEach((size) => {
        const existingSizeIndex = existingProduct.sizes.findIndex((existingSize) => existingSize.name === size.name);
        if (existingSizeIndex !== -1) {
          existingProduct.sizes[existingSizeIndex].quantity += size.quantity;
        }
      });

      await existingProduct.save();
    }

    const receipt = new Receipt({
      supplier,
      staff,
      date,
      deliver,
      products,
    });
    await receipt.save();

    io.getIO().emit("receipts", { action: "create", newReceipt: receipt });

    res.status(201).json({ message: "Nhập hàng thành công" });
  } catch (error) {
    next(error);
  }
};

exports.updateReceipt = async (req, res, next) => {
  const { supplier, date, deliver, products: updatedProducts, receiptId } = req.body;

  try {
    const receipt = await Receipt.findById(receiptId);
    if (!receipt) {
      throw new AppError(404, "Phiếu nhập hàng không tồn tại");
    }

    for (const product of receipt.products) {
      const existingProduct = await Product.findById(product.productId);
      if (existingProduct) {
        for (const size of product.sizes) {
          const selectedSizeIndex = existingProduct.sizes.findIndex((productSize) => productSize.name === size.name);
          existingProduct.sizes[selectedSizeIndex].quantity -= size.quantity;
        }

        const index = updatedProducts.findIndex((product) => product.productId === existingProduct._id.toString());

        for (const size of updatedProducts[index].sizes) {
          const selectedSizeIndex = existingProduct.sizes.findIndex((productSize) => productSize.name === size.name);
          existingProduct.sizes[selectedSizeIndex].quantity += size.quantity;
        }

        await existingProduct.save();
      }
    }

    receipt.supplier = supplier;
    receipt.date = date;
    receipt.deliver = deliver;
    receipt.products = updatedProducts;
    await receipt.save();

    io.getIO().emit("receipts", { action: "edit", editedReceipt: receipt });

    res.status(200).json({
      message: "Cập nhật phiếu nhập hàng thành công",
      updatedReceipt: receipt,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find().populate("staff").populate("products.productId");
    res.status(200).json({ receipts });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

exports.getReceiptById = async (req, res, next) => {
  const receiptId = req.params.receiptId;

  try {
    const receipt = await Receipt.findById(receiptId).populate("staff").populate("products.productId");
    if (!receipt) {
      throw new AppError(404, "Phiếu nhập hàng không tồn tại");
    }

    res.status(200).json({ receipt });
  } catch (error) {
    next(error);
  }
};
