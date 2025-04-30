const { check } = require('express-validator');

exports.createNotificationValidations = [
  check('title').notEmpty().isString().withMessage('אנא תוסיף כותרת לבקשה'),
  check('message').notEmpty().isString().withMessage('אנא רשום את ההודעה'),
  check('group').notEmpty(),
  check('battalion').notEmpty(),
];
