const {
  findUserAndDelete,
  findUserAndUpdate,
  findAndGetAllUser,
  findAndGetUser,
  createUser,
} = require("../services/AdminService");

// const { createSendToken } = require("./AuthController");

const AppError = require("../utils/AppError");

const catchAsync = require("../utils/AsyncMiddleware");

exports.getUser = catchAsync(async (req, res, next) => {
  if (req.query.id_number) {
    const query = await findAndGetUser(req.query);
    res.status(200).json({
      status: "success",
      query,
    });
  } else {
    return next(new AppError("לא נמצא משתמש עם מספר אישי כזה ", 404));
  }
  // res.status(200).json({
  //   status: "success",
  //   query,
  // });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await findAndGetAllUser();

  res.status(200).json({
    status: "success",
    users,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const doc = await findUserAndUpdate(req.query, req.body);

  if (!doc) {
    return next(new AppError("לא נמצא משתמש עם מספר אישי כזה", 404));
  }

  res.status(200).json({
    status: "success",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await findUserAndDelete(req.query);
  if (!user) {
    return next(new AppError("אין משתמש עם מספר אישי כזה", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body, "💥💥💥");
  const newUser = await createUser(req.body);
  res.status(200).json({
    status: "success",
    newUser,
  });
});
