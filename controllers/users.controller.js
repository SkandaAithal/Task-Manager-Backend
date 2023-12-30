const userCollection = require("../model/usersSchema");
const asyncHelper = require("../helpers/asyncHelper");
const bcrypt = require("bcryptjs");
const customErrors = require("../helpers/customErrors");
const jsonwebtoken = require("jsonwebtoken");
const { createOtp, encryptData, otpVerify } = require("../helpers/otpHelper");
const { invitationMail, otpMail } = require("../helpers/mailHelper");

const signup = asyncHelper(async (req, res, next) => {
  let { fullname, mobile, password, email, gender, skills } = req.body;

  password = await encryptData(password);

  let userEmail = await userCollection.findOne({
    email: email,
  });
  let userPhone = await userCollection.findOne({ mobile: mobile });
  if (userEmail) {
    next(customErrors("Email already exists", 400));
  } else if (userPhone) {
    next(customErrors("Phone Number already exists", 401));
  } else {
    await invitationMail(email, fullname);
    await userCollection.create({
      fullname,
      mobile,
      password,
      email,
      gender,
      skills,
    });

    return res.status(201).json({
      error: false,
      message: "SignUp Successfully",
      data: { fullname, mobile, password, email, gender, skills },
    });
  }
});

const login = asyncHelper(async (req, res, next) => {
  let { firstfield, password } = req.body;
  let isUserAvailable;
  if (!firstfield.includes("@")) {
    isUserAvailable = await userCollection.findOne({
      mobile: Number(firstfield),
    });
  } else {
    isUserAvailable = await userCollection.findOne({
      email: firstfield,
    });
  }

  if (isUserAvailable) {
    if (await bcrypt.compare(password, isUserAvailable.password)) {
      let otp = await createOtp(isUserAvailable.email);
      await otpMail(isUserAvailable.email, isUserAvailable.fullname, otp);

      return res
        .status(200)
        .json({ error: false, message: "OTP Sent to Your email" });
    } else {
      next(customErrors("invalid password", 400));
    }
  } else {
    next(customErrors("wrong mobile or email", 400));
  }
});

const singleuser = asyncHelper(async (req, res, next) => {
  let singleuser = await userCollection.findOne({ email: req.userToken });
  if (singleuser) {
    res.status(200).json({ error: false, singleuser });
  } else {
    next(customErrors("user not found", 404));
  }
});

const verifyotp = asyncHelper(async (req, res, next) => {
  let { email, otp } = req.body;

  let userOtpverified = await otpVerify(email, otp);
  console.log(userOtpverified);
  if (userOtpverified) {
    await userCollection.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );
    let token = jsonwebtoken.sign({ email }, "sk123", {
      expiresIn: "1d",
    });
    return res.status(200).json({
      error: false,
      message: "Logged in Successfully",
      token,
    });
  } else {
    next(customErrors("invalid OTP", 404));
  }
});
module.exports = { login, signup, singleuser, verifyotp };
