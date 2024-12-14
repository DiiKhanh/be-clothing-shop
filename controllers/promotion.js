const Customer = require("../models/customer");
const Promotion = require("../models/promotion");
const AppError = require("../util/error");

exports.getPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json({ promotions });
  } catch (error) {
    next(error);
  }
};

exports.getPromotionById = async (req, res, next) => {
  const promotionId = req.params.promotionId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyễn mãi không tồn tại");
    }

    res.status(200).json({ promotion });
  } catch (error) {
    next(error);
  }
};

exports.createPromotion = async (req, res, next) => {
  const { name, description, percentage, startDate, endDate, amount, minPrice } = req.body;

  try {
    const promotion = new Promotion({
      name,
      description,
      percentage,
      startDate,
      endDate,
      amount,
      minPrice,
    });
    await promotion.save();

    const milliseconds = endDate.getTime() - startDate.getTime();
    setTimeout(() => {
      promotion.expired = true;
      promotion.save();
    }, milliseconds);

    res.status(201).json({ promotion, message: "Tạo khuyến mãi thành công" });
  } catch (error) {
    next(error);
  }
};

exports.editPromotion = async (req, res, next) => {
  const { name, description, percentage, startDate, endDate, amount, minPrice } = req.body;
  const promotionId = req.params.promotionId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyến mãi không tồn tại");
    }

    promotion.name = name;
    promotion.description = description;
    promotion.percentage = percentage;
    promotion.startDate = startDate;
    promotion.endDate = endDate;
    promotion.amount = amount;
    promotion.minPrice = minPrice;
    await promotion.save();

    res.status(200).json({ message: "Cập nhật khuyến mãi thành công" });
  } catch (error) {
    next(error);
  }
};

exports.deletePromotion = async (req, res, next) => {
  const promotionId = req.params.promotionId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyến mãi không tồn tại");
    }

    promotion.expired = true;
    await promotion.save();

    res.status(200).json({ message: "Xóa khuyến mãi thành công" });
  } catch (error) {
    next(error);
  }
};

exports.savePromotion = async (req, res, next) => {
  const { promotionId, customerId } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new AppError(404, "Khách hàng không tồn tại");
    }

    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyến mãi không tồn tại");
    }

    customer.promotions.push(promotionId);
    await customer.save();

    res.status(200).json({ message: "Lưu khuyến mãi thành công", promotion });
  } catch (error) {
    next(error);
  }
};

exports.removePromotion = async (req, res, next) => {
  const promotionId = req.params.promotionId;
  const customerId = req.customerId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyến mãi không tồn tại");
    }

    const customer = await Customer.findById(customerId).populate("promotions");
    if (!customer) {
      throw new AppError(404, "Khách hàng không tồn tại");
    }

    const updatedPromotions = customer.promotions.filter((promotion) => promotion._id.toString() !== promotionId);
    customer.promotions = updatedPromotions;
    await customer.save();

    res.status(200).json({ message: "Xóa mã thành công", updatedPromotions });
  } catch (error) {
    next(error);
  }
};

exports.updatePromotionQuantity = async (req, res, next) => {
  const promotionId = req.params.promotionId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyến mãi không tồn tại");
    }

    promotion.amount -= 1;
    await promotion.save();

    res.status(200).json({ updatedPromotion: promotion });
  } catch (error) {
    next(error);
  }
};

exports.restorePromotion = async (req, res, next) => {
  const promotionId = req.params.promotionId;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      throw new AppError(404, "Khuyến mãi không tồn tại");
    }

    promotion.expired = false;
    await promotion.save();

    res.status(200).json({ message: "Khôi phục khuyến mãi thành công" });
  } catch (error) {
    next(error);
  }
};
