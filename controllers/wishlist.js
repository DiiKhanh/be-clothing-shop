const Customer = require("../models/customer");
const Product = require("../models/product");
const AppError = require("../util/error");

exports.addToWishlist = async (req, res, next) => {
  const customerId = req.customerId;
  const productId = req.body.productId;

  try {
    const customer = await Customer.findById(customerId).populate('wishlist');
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng");
    }

    const product = await Product.findById(productId)
    if (!product) {
      throw new AppError(404, "Sản phẩm không tồn tại");
    }

    const existingWishlistProduct = customer.wishlist.find((item) => item._id.toString() === productId.toString());
    if (existingWishlistProduct) {
      throw new AppError(422, "Sản phẩm này đã tồn tại trong danh sách yêu thích");
    }

    customer.wishlist.push(product);
    await customer.save();

    res.status(200).json({ wishlist: customer.wishlist, message: "Đã thêm sản phẩm vào danh sách yêu thích" });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  const customerId = req.customerId;
  const productId = req.body.productId;

  try {
    const customer = await Customer.findById(customerId).populate('wishlist');
    if (!customer) {
      throw new AppError(404, "Không tìm thấy khách hàng");
    }

    const existingProduct = customer.wishlist.find((item) => item._id.toString() === productId.toString());
    if (!existingProduct) {
      return res.status(422).json({ message: "Sản phẩm không tồn tại trong danh sách yêu thích" });
    }

    const updatedProducts = customer.wishlist.filter((item) => item._id.toString() !== productId.toString());
    customer.wishlist = updatedProducts;
    await customer.save();

    res.status(200).json({ wishlist: customer.wishlist, message: "Đã xoá sản phẩm khỏi danh sách yêu thích" });
  } catch (error) {
    next(error);
  }
};
