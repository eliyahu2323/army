const User = require('../models/UserModel');

exports.findUserAndUpdateImage = (currentUser, query) => {
  console.log(currentUser);
  return User.findByIdAndUpdate(
    currentUser,
    {
      $addToSet: { photo: query },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};
