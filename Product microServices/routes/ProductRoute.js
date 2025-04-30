const express = require('express');

const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  getProductByNameGroup,
  updateStatusProduct,
  updateLocationProduct,
  updateGroup,
} = require('../controllers/ProductController.js');
const {
  createProductValidations,
  getProductByIdValidations,
} = require('./../validations/business');
const validate = require('../utils/ValidateResource');
const router = express.Router();

router.get(
  '/getProductById',
  getProductByIdValidations,
  validate(),
  getProductById
);

router.get('/getAllProducts', getAllProducts);
router.get('/getProductByNameGroup', getProductByNameGroup);
router.patch('/updateStatusProduct', updateStatusProduct);
router.patch('/updateLocationProduct', updateLocationProduct);
router.patch('/updateGroup', updateGroup);

router.post(
  '/createProduct',
  createProductValidations,
  validate(),
  createProduct
);
router.delete('/deleteProduct', deleteProduct);

module.exports = router;
