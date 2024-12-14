const Event = require("../models/event");

exports.getReadyToSellEvent = async (req, res, next) => {
  try {
    const readyToSellEvents = await Event.find({ title: { $regex: "Mở Bán" } }).populate("relatedProducts");
    res.status(200).json({ events: readyToSellEvents });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};

exports.getEventByTag = async (req, res, next) => {
  const eventTag = req.params.eventTag;

  try {
    const event = await Event.findOne({ tag: eventTag }).populate("relatedProducts");
    res.status(200).json({ event });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};
