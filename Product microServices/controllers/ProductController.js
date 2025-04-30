const catchAsync = require('../utils/AsyncMiddleware');
const AppError = require('../utils/AppError');
const {
  findAllProducts,
  findProduct,
  findProductByIdAndUpdateStatus,
  findProductByIdAndUpdateLocation,
  findProductByIdAndUpdateGroup,
  findProductAndDelete,
  createProduct,
} = require('../services/ProductService');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await findAllProducts();
  if (!products) {
    next(new AppError('This Data is undefined.', 400));
  }
  res.status(200).json({
    status: 'success',
    products,
  });
});

exports.updateStatusProduct = catchAsync(async (req, res, next) => {
  const status = await findProduct(req.query);
  if (status[0].status_product === true) {
    await findProductByIdAndUpdateStatus(status[0].id, false);
  } else {
    await findProductByIdAndUpdateStatus(status[0].id, true);
  }
  res.status(200).json({
    status,
  });
});

exports.updateLocationProduct = catchAsync(async (req, res, next) => {
  const product = await findProductByIdAndUpdateLocation(req.query, req.body);
  res.status(200).json({
    status: 'success',
    product,
  });
});

exports.updateGroup = catchAsync(async (req, res, next) => {
  console.log(req.query, req.body);
  const group = await findProductByIdAndUpdateGroup(req.query, req.body);
  res.status(200).json({
    status: 'success',
    group,
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await findProduct(req.query);
  if (!product) {
    next(new AppError('This Data is undefined.', 400));
  }
  res.status(200).json({
    status: 'success',
    product,
  });
});

exports.getProductByNameGroup = catchAsync(async (req, res, next) => {
  const product = await findProduct(req.query);
  if (!product) {
    next(new AppError('This Data is undefined.', 400));
  }
  res.status(200).json({
    status: 'success',
    product,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await createProduct(req.body);
  if (!product) {
    next(new AppError('This Data is undefined.', 400));
  }

  res.status(200).json({
    status: 'success',
    product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const product = await findProductAndDelete(req.query);
  if (!product) {
    next(new AppError('This Data is undefined.', 400));
  }
  res.status(200).json({
    status: 'success',
    product,
  });
});
