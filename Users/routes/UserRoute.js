const express = require("express");

const {
  getMe,
  updateMe,
  deleteMe,
  login,
  forgotPassword,
  restPassword,
  protect,
  updatePassword,
  restrictTo,
} = require("../controllers/UserController");

const {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  signup,
} = require("../controllers/AdminController");

const uploadImage = require("../utils/UploadImage");

const {
  SignUpValidations,
  SignValidations,
} = require("./../validations/business");
const validate = require("../utils/ValidateResource");

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: User
 *   description: API to manage users
 */

/**
 * @openapi
 *   /api/v1/users/login:
 *     post:
 *       description: Connecting to the system using an active user
 *       parameters:
 *          - name: email
 *            in: formData
 *            required: true
 *            type: string
 *            description: email of person
 *          - name: password
 *            password: password
 *            in: formData
 *            description: password of email
 *       responses:
 *         "200":
 *           description: Success
 */

router.post("/login", SignValidations, validate(), login);

/**
 * @openapi
 *   /api/v1/users/forgotPassword:
 *     post:
 *       description: Password reset request by sending a verification code to email
 *       parameters:
 *          - name: email
 *            in: formData
 *            required: true
 *            type: string
 *            description: Email to which the verification code will be sent
 *       responses:
 *         "200":
 *           description: Success
 */
router.post("/forgotPassword", forgotPassword);

/**
 * @openapi
 *   /api/v1/users/resetPassword/:token:
 *     patch:
 *       description: Function requires the verification code sent to the email and the new password and password verification
 *       parameters:
 *          - name: password
 *            in: formData
 *            required: true
 *            type: string
 *            description: New password
 *          - name: passwordConfirm
 *            in: formData
 *            required: true
 *            type: string
 *            description: Confirm the new password
 *       responses:
 *         "200":
 *           description: Success
 */
router.patch("/resetPassword/:token", restPassword);
router.get("/getUser", getUser);
router.use(protect);
/**
 * @openapi
 *   /api/v1/users/updateMyPassword:
 *     patch:
 *       description: Function requires the verification code sent to the email and the new password and password verification
 *       parameters:
 *          - name: Current password
 *            in: formData
 *            required: true
 *            type: string
 *            description: Current password
 *          - name: New password
 *            in: formData
 *            required: true
 *            type: string
 *            description: New password
 *          - name: passwordConfirm
 *            in: formData
 *            required: true
 *            type: string
 *            description: Confirm new password
 *       responses:
 *         "200":
 *           description: Success
 */
router.patch("/updateMyPassword", updatePassword);
router.get("/me", getMe, getUser);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));
/**
 * @openapi
 *   /api/v1/users/signup:
 *     post:
 *       description: Creating a new user, Only an administrator can create a user
 *       parameters:
 *          - name: name
 *            in: formData
 *            required: true
 *            type: string
 *            description: The name of the new user
 *          - name: email
 *            in: formData
 *            required: true
 *            type: string
 *            description: The email of the new user
 *          - name: password
 *            in: formData
 *            required: true
 *            type: string
 *            description: The password
 *          - name: passwordConfirm
 *            in: formData
 *            required: true
 *            type: string
 *            description: Confirm password
 *       responses:
 *         "200":
 *           description: Success
 */
router.post("/signup", SignUpValidations, validate(), signup);
// router.post("/signup", signup);

router.get("/getAllUsers", getAllUsers);
router.delete("/deleteUser", deleteUser);
router.patch("/updateUser", updateUser);

module.exports = router;
