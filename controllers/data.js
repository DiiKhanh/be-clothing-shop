const jwt = require("jsonwebtoken");

const Customer = require("../models/customer");
const Category = require("../models/category");

exports.getCommonData = async (req, res, next) => {
  try {
    const categories = await Category.find();

    const authHeader = req.get("Authorization");
    if (!authHeader) {
      return res.status(200).json({ categories });
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, "secret");
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }

    const customerId = decodedToken.customerId;

    const customer = await Customer.findById(customerId)
      .populate("account")
      .populate("cart.productId")
      .populate("orders")
      .populate("wishlist")
      .populate("promotions");

    res.status(200).json({ categories, customer: customer });
  } catch (error) {
    next(error);
  }
};
