const {
  findUserAndDelete,
  findUserAndUpdate,
  findUser,
  findOne,
} = require("../services/UserService");
const crypto = require("crypto");
const sendEmail = require("../utils/Email");

const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { createSendToken } = require("./AuthController");

const AppError = require("../utils/AppError");

const catchAsync = require("../utils/AsyncMiddleware");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await findUserAndDelete(req.user.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use / updateMyPassword.",
        400
      )
    );
  }
  const filterBody = filterObj(req.body, "name", "email");
  // const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody);
  const updatedUser = await findUserAndUpdate(req.user.id, filterBody);

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  const user = await findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const tokenWithoutPrefix = req.headers.authorization.replace("Bearer ", "");
    token = tokenWithoutPrefix;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await findUser(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggeIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt === "loggedout") return next();

  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    const currentUser = await findUser(decoded.id);
    if (!currentUser) {
      return next();
    }

    if (currentUser.changePasswordAfter(decoded.iat)) {
      return next();
    }

    res.locals.user = currentUser;
    return next();
  }

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get("host")} /
    api /
    v1 /users/
    resetPassword/${resetToken}}`;

  const message = `קוד איפוס סיסמא הוא: ${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: " success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user: (user) => ({
      ...user,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });

    await findOne({ email: req.body.email });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.restPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await findUser(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  user: (user) => ({
    ...user,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  await user.save();

  createSendToken(user, res);
});
