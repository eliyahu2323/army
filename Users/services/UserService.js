const User = require("../models/UserModel");

exports.findUserAndDelete = (query) => {
  return User.findByIdAndDelete(query, { active: false });
};

exports.findUserAndUpdate = (id, query) => {
  return User.findByIdAndUpdate({ _id: id }, query);
};

exports.findAndGetUser = (query) => {
  return User.findById(query);
};
exports.findUser = (query) => {
  return User.findById(query);
};

exports.findOne = (query) => {
  return User.findOne(query);
};
