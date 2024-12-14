const { cloudinary } = require("../util/cloudinary");

const AppError = require("../util/error");

exports.getIntroImages = async (req, res, next) => {
  try {
    const { resources } = await cloudinary.search.expression("folder:clothingshop/banners/intro").execute();
    if (!resources) {
      const error = new AppError(404, "Không tìm thấy ảnh");
      return next(error);
    }

    res.status(200).json({ images: resources });
  } catch (error) {
    const err = new AppError(500, "Có lỗi xảy ra, vui lòng thử lại sau");
    next(err);
  }
};
