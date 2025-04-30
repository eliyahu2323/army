const Product = require('../models/ProductModel');

exports.findAllProducts = () => {
  return Product.find().sort({ group_name: 1 });
};

exports.findProduct = (query) => {
  return Product.find(query);
};

exports.findProductByIdAndUpdateStatus = (id_product, query) => {
  return Product.findByIdAndUpdate(id_product, { status_product: query });
};

exports.findProductByIdAndUpdateLocation = (id_product, query) => {
  // console.log(id_product, query);
  return Product.findByIdAndUpdate(id_product, query);
};

exports.findProductByIdAndUpdateGroup = (id_product, query) => {
  return Product.updateOne(id_product, query);
};

exports.findProductAndDelete = async (id) => {
  let product = await Product.find(id);
  return Product.findByIdAndDelete(product);
};

exports.createProduct = (query) => {
  return Product.create(query);
};
