const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: [true, 'Please confirm name of group'],
  },
  product_name: {
    type: String,
    required: [true, 'Please confirm name of product'],
  },
  id_product: {
    type: Number,
    unique: true,
    required: [true, 'Please confirm id of product'],
  },
  locationProduct: {
    type: String,
    default: '',
  },
  status_product: {
    type: Boolean,
    default: false,
    select: true,
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
