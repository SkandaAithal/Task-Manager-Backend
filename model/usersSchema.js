const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
  },
  otp: {
    type: String,
    required: true,
    default: "123456",
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = model("User", userSchema);
