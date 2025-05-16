const Product = require('../models/ProductModel');

exports.findAllProducts = () => {
  return Product.find().sort({ group_name: 1 });
};

exports.findProduct = (query) => {
  // console.log(query);
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

exports.createProduct = async (query) => {
  // console.log(query.id_product);
  let prod = await Product.find({ id_product: query.id_product });
  console.log(prod);
  if (prod[0]) {
    return;
  } else {
    return Product.create(query);
  }
  // return Product.create(query);
};
