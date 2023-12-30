const bcrypt = require("bcryptjs");
const userCollection = require("../model/usersSchema");

const createOtp = async (email) => {
  let otp = Math.random().toString().split(".")[1].slice(0, 6);
  let expirationDuration = 1 * 60 * 1000;
  let expiry = new Date().getTime() + expirationDuration;

  let hash = await encryptData(otp);
  let hashedOTP = `${hash}.${expiry}`;

  await userCollection.findOneAndUpdate(
    { email },
    { otp: hashedOTP },
    { runValidators: true }
  );
  return otp;
};

const encryptData = async (data) => {
  let salt = await bcrypt.genSalt(10);
  let hashData = await bcrypt.hash(data, salt);
  return hashData;
};

const otpVerify = async (email, otp) => {
  let user = await userCollection.findOne({ email });
  let userOTPexpiryfromDB = user.otp.slice(user.otp.lastIndexOf(".") + 1);

  if (
    new Date().getTime() < userOTPexpiryfromDB &&
    (await bcrypt.compare(otp, user.otp.slice(0, user.otp.lastIndexOf("."))))
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = { createOtp, encryptData, otpVerify };
