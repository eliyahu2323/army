const User = require("../models/UserModel");

exports.findAndGetUser = (query) => {
  return User.find(query);
};

exports.findAndGetAllUser = () => {
  return User.find();
};

exports.findUserAndDelete = (query) => {
  return User.findByIdAndDelete(query, { active: false });
};

exports.findUserAndUpdate = (id, query) => {
  return User.findByIdAndUpdate(id, query);
};

exports.createUser = (query) => {
  return User.create(query);
};
