const { check } = require("express-validator");

exports.SignUpValidations = [
  check("name")
    .isString()
    .isLength({ min: 2 })
    .withMessage("שם חייב להכיל לפחות 2 אותיות"),
  check("group")
    .notEmpty()
    .isString()
    .withMessage("חייב לציין פלוגה")
    .isLength({ min: 2 }),
  check("battalion")
    .notEmpty()
    .withMessage("חייב לציין פלוגה")
    .isLength({ min: 2 }),
  check("email").isEmail().withMessage("כתובת מייל אינה תקינה"),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("סיסמא חייבת להכיל לחופת 8 תווים"),
  check("passwordConfirm")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("אימות סיסמא חייב להכיל לפחות 8 תווים"),
  check("phone")
    .notEmpty()
    .withMessage("נדרש להוסיף מספר טלפון")
    .matches(/^(0\d|02|05\d)-?\d{7}$/)
    .withMessage("מספר טלפון לא תקין"),
  check("id_number").notEmpty().isNumeric().withMessage("מספר טלפון לא תקין"),
];

exports.SignValidations = [
  check("password")
    .not()
    .isEmpty()
    .isLength({ min: 8 })
    .withMessage("password must have more than 8 characters"),
  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("The email address is not valid"),
];
