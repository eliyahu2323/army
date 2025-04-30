// const catchAsync = require("../utils/AsyncMiddleware");
// const axios = require("axios");

// exports.createSendToken = catchAsync(async (user, res) => {
//   try {
//     const response = await axios.post("http://127.0.0.1:3000/createSendToken", {
//       user: user,
//     });
//     res.send(response.data);
//   } catch (e) {
//     console.log("Login failed from send token");
//   }
// });

// `http://${process.env.AUTH_API_ADDRESS}/createSendToken`,

const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createSendToken = async (req, res, next) => {
  const token = signToken(req._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "development") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  req.password = undefined;
  res.send({
    status: "success",
    token,
    data: {
      user: req,
    },
  });
};
