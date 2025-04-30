const { check } = require('express-validator');

exports.getProductByIdValidations = [
  check('id_product')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Id product must have more than 6 characters'),
];

exports.createProductValidations = [
  check('id_product')
    .isNumeric()
    .notEmpty()
    .withMessage('חייב להיות צ' + 'למכשיר')
    .isLength({ min: 6 })
    .withMessage('Id product must have more than 6 characters'),
  check('product_name')
    .notEmpty()
    .isString()
    .isLength({ min: 2 })
    .withMessage('Name product must have more than 2 characters'),
  check('group_name')
    .notEmpty()
    .isString()
    .isLength({ min: 1 })
    .withMessage('Name product must have more than 2 characters'),
];
