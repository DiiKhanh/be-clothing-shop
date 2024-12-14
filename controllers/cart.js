const Customer = require("../models/customer");
const AppError = require("../util/error");

exports.addToCart = async (req, res, next) => {
  const customerId = req.customerId;
  const item = {
    productId: req.body.productId,
    size: req.body.size,
    quantity: req.body.quantity,
  };

  try {
    const customer = await Customer.findById(customerId).populate("cart.productId");
    if (!customer) {
      throw new AppError(404, "Không tìm thấy người dùng");
    }

    const updatedCart = customer.cart;
    const existingProductIndex = updatedCart.findIndex(
      (cartItem) => cartItem.productId._id.toString() === item.productId.toString() && cartItem.size === item.size
    );

    if (existingProductIndex >= 0) {
      updatedCart[existingProductIndex].quantity += item.quantity;
    } else {
      updatedCart.push(item);
    }

    customer.cart = updatedCart;
    await customer.save();
    await customer.populate("cart.productId");

    res.status(200).json({ cart: customer.cart });
  } catch (err) {
    next(err);
  }
};

exports.updateQuantity = async (req, res, next) => {
  const customerId = req.customerId;
  const item = {
    productId: req.body.productId,
    size: req.body.size,
    quantity: req.body.quantity,
  };

  try {
    const customer = await Customer.findById(customerId).populate("cart.productId");
    if (!customer) {
      throw new AppError(404, "Không tìm thấy người dùng");
    }

    const productIds = customer.cart.map((cartItem) => cartItem.productId._id.toString());
    const cartItemSizes = customer.cart.map((cartItem) => cartItem.size);

    if (!productIds.includes(item.productId.toString()) || !cartItemSizes.includes(item.size)) {
      throw new AppError(400, "Sản phẩm không tồn tại trong giỏ hàng");
    }

    const cartItemIndex = customer.cart.findIndex(
      (cartItem) => cartItem.productId._id.toString() === item.productId.toString() && cartItem.size === item.size
    );
    customer.cart[cartItemIndex].quantity = item.quantity;
    await customer.save();

    res.status(200).json({ message: "Cập nhật giỏ hàng thành công", cart: customer.cart });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  const customerId = req.customerId;
  const item = {
    productId: req.body.productId,
    size: req.body.size,
  };

  try {
    const customer = await Customer.findById(customerId).populate("cart.productId");
    if (!customer) {
      throw new AppError(404, "Không tìm thấy người dùng");
    }

    const existingCartItem = customer.cart.find(
      (cartItem) => cartItem.productId._id.toString() === item.productId && cartItem.size === item.size
    );
    if (!existingCartItem) {
      throw new AppError(400, "Sản phẩm không tồn tại trong giỏ hàng");
    }

    customer.cart = customer.cart.filter((cartItem) => cartItem !== existingCartItem);
    await customer.save();

    res.status(200).json({ message: "Xóa sản phẩm thành công", cart: customer.cart });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItems = async (req, res, next) => {
  const items = req.body.items;
  const customerId = req.customerId;

  try {
    const customer = await Customer.findById(customerId).populate("cart.productId");
    if (!customer) {
      throw new AppError(404, "Không tìm thấy người dùng");
    }

    for (const item of items) {
      const existingCartItem = customer.cart.find(
        (cartItem) => cartItem.productId._id.toString() === item.productId && cartItem.size === item.size
      );

      if (!existingCartItem) {
        throw new AppError(400, "Sản phẩm không tồn tại");
      }

      customer.cart = customer.cart.filter((cartItem) => cartItem !== existingCartItem);
    }
    await customer.save();

    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng", cart: customer.cart });
  } catch (err) {
    next(err);
  }
};
