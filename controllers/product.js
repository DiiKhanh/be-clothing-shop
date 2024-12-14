const { ITEMS_PER_PAGE, sizes, productStates } = require('../constants');
const Category = require('../models/category');
const Product = require('../models/product');
const { cloudinary } = require('../util/cloudinary');
const AppError = require('../util/error');
const io = require('../socket');
const createRedisClient = require('../util/redis');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    const error = new Error('Có lỗi xảy ra, vui lòng thử lại sau');
    error.statusCode = 500;
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  const redisClient = createRedisClient();

  try {
    const cachedProduct = await redisClient.get(`product:${productId}`);

    if (cachedProduct) {
      console.log('Cache hit for product:', productId);
      return res.status(200).json({ product: JSON.parse(cachedProduct) });
    }
    const product = await Product.findById(productId).populate('category');
    if (!product) {
      const error = new Error('Không tìm thấy sản phẩm');
      error.statusCode = 404;
      return next(error);
    }

    await redisClient.set(`product:${productId}`, JSON.stringify(product), 'EX', 3600);

    res.status(200).json({ product });
  } catch (err) {
    const error = new Error('Có lỗi xảy ra, vui lòng thử lại sau');
    error.statusCode = 500;
    next(error);
  }
};

exports.getHotProducts = async (req, res, next) => {
  try {
    const sortedProducts = await Product.find().sort({ totalSold: -1 }).limit(12).exec();
    res.status(200).json({ products: sortedProducts });
  } catch (err) {
    const error = new Error('Có lỗi xảy ra, vui lòng thử lại sau');
    error.statusCode = 500;
    next(error);
  }
};

exports.getDiscountProducts = async (req, res, next) => {
  try {
    const discountProducts = await Product.find({ oldPrice: { $ne: null } });
    res.status(200).json({ products: discountProducts });
  } catch (err) {
    const error = new Error('Có lỗi xảy ra, vui lòng thử lại sau');
    error.statusCode = 500;
    next(error);
  }
};

exports.getProductsByType = async (req, res, next) => {
  const typeName = req.params.typeName;

  try {
    const products = await Product.find({ name: { $regex: typeName } }).populate('category');
    res.status(200).json({ products });
  } catch (err) {
    const error = new Error('Có lỗi xảy ra, vui lòng thử lại sau');
    error.statusCode = 500;
    next(error);
  }
};

exports.getProductsByKeyword = async (req, res, next) => {
  const keyword = req.params.keyword;
  const page = +req.query.page || 1;

  try {
    const products = await Product.find({ name: { $regex: keyword, $options: 'i' } })
      .populate('category')
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const totalItems = await Product.find({ name: { $regex: keyword, $options: 'i' } }).countDocuments();

    res.status(200).json({
      products,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (err) {
    const error = new Error('Có lỗi xảy ra, vui lòng thử lại sau');
    error.statusCode = 500;
    next(error);
  }
};

exports.getProductsByFilters = async (req, res, next) => {
  try {
    let products = [];
    let category = await Category.findOne({ 'types._id': req.query.categoryId }).populate('products').populate({
      path: 'types',
      populate: 'products',
    });
    if (!category) {
      category = await Category.findById(req.query.categoryId).populate('products').populate({
        path: 'types',
        populate: 'products',
      });
      products = category.products;
    } else {
      const selectedType = category.types.find((type) => type._id.toString() === req.query.categoryId);
      products = selectedType.products;
    }

    if (!category) {
      return res.status(404).json({ products: [] });
    }

    if (req.query.types !== 'null') {
      products = [];
      const productIds = new Set();
    
      const types = req.query.types.split(',').map(type => type.trim());
      const categoryTypes = category.types;
    
      for (const type of types) {
        const categoryType = categoryTypes.find((item) => item.type === type);
    
        if (categoryType && type !== category.name) {
          categoryType.products.forEach(product => {
            const productId = product._id.toString();
            if (!productIds.has(productId)) {
              products.push(product);
              productIds.add(productId);
            }
          });
        } else if (type === category.name) {
          category.products.forEach(product => {
            const productId = product._id.toString();
            if (!productIds.has(productId)) {
              products.push(product);
              productIds.add(productId);
            }
          });
        }
      }
    }

    if (req.query.priceFrom !== 'null' && req.query.priceTo !== 'null') {
      const priceFrom = +req.query.priceFrom;
      const priceTo = +req.query.priceTo;

      products = products.filter((product) => product.price >= priceFrom && product.price <= priceTo);
    }

    if (req.query.materials !== 'null') {
      const materials = req.query.materials.split(',');
      products = products.filter(
        (product) =>
          materials.findIndex((item) => product.description.toLowerCase().includes(item.toLowerCase())) !== -1,
      );
    }

    if (req.query.textures !== 'null') {
      const textures = req.query.textures.split(',');
      products = products.filter(
        (product) =>
          textures.findIndex((item) => product.description.toLowerCase().includes(item.toLowerCase())) !== -1,
      );
    }

    res.status(200).json({ products });
  } catch (error) {
    next(new AppError(500, 'Có lỗi xảy ra, vui lòng thử lại sau'));
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, categoryId, price, description, mainImg, subImg, mainFolder, subFolder } = req.body;

    const mainImgResponse = cloudinary.uploader.upload(mainImg, {
      folder: mainFolder,
    });

    const subImgResponse = cloudinary.uploader.upload(subImg, {
      folder: subFolder,
    });

    const [mainImgResult, subImgResult] = await Promise.all([mainImgResponse, subImgResponse]);

    let category;

    category = await Category.findById(categoryId);
    if (!category) {
      const categories = await Category.find();
      category = categories.find(
        (category) => category.types.findIndex((item) => item._id.toString() === categoryId) !== -1,
      );

      if (!category) {
        throw new AppError(422, 'Mã danh mục không tồn tại');
      }
    }

    const product = new Product({
      name,
      category: category._id,
      price,
      description,
      images: { mainImg: mainImgResult.public_id, subImg: subImgResult.public_id },
      sizes: Object.values(sizes).map((size) => ({ name: size, quantity: 0, sold: 0 })),
    });
    await product.save();

    category.products.push(product._id);

    if (category.types.length > 0) {
      const currentTypeIndex = category.types.findIndex((item) => item._id.toString() === categoryId);
      category.types[currentTypeIndex].products.push(product._id);
    }

    await category.save();

    io.getIO().emit('products', { action: 'create', product: product });

    res.status(201).json({ message: 'Tạo sản phẩm thành công', product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const redisClient = createRedisClient();
  const { name, description, price, oldPrice, categoryId, mainImg, subImg, mainFolder, subFolder } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Sản phẩm không tồn tại');
    }

    /**
     * Handle uploading images
     */
    if (mainImg) {
      const splitedMainImgPath = product.images.mainImg.split('/');
      const mainImgPublicId = splitedMainImgPath[splitedMainImgPath.length - 1];
      await cloudinary.uploader.destroy(mainImgPublicId);

      const newMainImg = await cloudinary.uploader.upload(mainImg, {
        folder: mainFolder,
      });
      product.images.mainImg = newMainImg.public_id;
    }

    if (subImg) {
      const splitedSubImgPath = product.images.subImg.split('/');
      const subImgPublicId = splitedSubImgPath[splitedSubImgPath.length - 1];
      await cloudinary.uploader.destroy(subImgPublicId);

      const newSubImg = await cloudinary.uploader.upload(subImg, {
        folder: subFolder,
      });
      product.images.subImg = newSubImg.public_id;
    }

    /**
     * Handle pulling and pushing products in categories
     */
    if (categoryId !== undefined) {
      const oldCategory = await Category.findById(product.category);
      oldCategory.products.pull(product._id);

      if (oldCategory.types.length > 0) {
        const currentTypeIndex = oldCategory.types.findIndex(
          (item) => item.products.findIndex((productId) => productId.toString() === product._id.toString()) !== -1,
        );
        oldCategory.types[currentTypeIndex].products = oldCategory.types[currentTypeIndex].products.filter(
          (productId) => productId.toString() !== product._id.toString(),
        );
      }
      await oldCategory.save();

      const categories = await Category.find();
      let newCategory = categories.find(
        (category) => category.types.findIndex((item) => item._id.toString() === categoryId) !== -1,
      );
      if (!newCategory) {
        newCategory = await Category.findById(categoryId);
      }

      newCategory.products.push(product._id);

      if (newCategory.types.length > 0) {
        const currentTypeIndex = newCategory.types.findIndex((item) => item._id.toString() === categoryId);
        newCategory.types[currentTypeIndex].products.push(product._id);
      }
      await newCategory.save();

      product.category = newCategory._id;
    }

    /**
     * Update product details
     */
    product.name = name;
    product.description = description;
    product.price = price;
    if (oldPrice) {
      product.oldPrice = oldPrice;
    }
    await product.save();
    await redisClient.del(`product:${productId}`);

    io.getIO().emit('products', { action: 'edit', updatedProduct: product });

    res.status(200).json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    next(error);
  }
};

exports.stopSelling = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError(404, 'Sản phẩm không tồn tại');
    }

    product.state = productStates.PAUSE;
    await product.save();

    io.getIO().emit('products', { action: 'delete', productId: product._id.toString() });

    res.status(200).json({ message: 'Sản phẩm đã được ngừng bán' });
  } catch (error) {
    next(error);
  }
};

exports.resellProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError(404, 'Sản phẩm không tồn tại');
    }

    product.state = productStates.ACTIVE;
    await product.save();

    io.getIO().emit('products', { action: 'resell', productId: product._id.toString() });

    res.status(200).json({ message: 'Sản phẩm đã được bán lại' });
  } catch (error) {
    next(error);
  }
};
