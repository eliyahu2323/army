const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");

moment.tz.setDefault("Israel");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    id_number: {
      type: Number,
      required: [true, "Please provide your Id Number"],
      unique: true,
    },
    group: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
    },
    battalion: {
      type: String,
      required: [true, "אנא השלם מספר גדוד"],
    },
    phone: {
      type: Number,
      required: [true, "Please provide your number phone"],
      unique: true,
    },

    photo: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      maxlength: 18,
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        //This only work on Create and save!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not the same",
      },
    },
    passwordChangeAt: Date, //Date we changed the password
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // bcrypt is encryption utility
  //install :npm i bcryptjs

  //Hase the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = Date.now();
  this.passwordChangeAt.setUTCHours(this.passwordChangeAt.getUTCHours() + 3);
  next();
});

userSchema.pre(/^find/, function (next) {
  //This points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  //False means NOT change
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
