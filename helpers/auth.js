const jsonwebtoken = require("jsonwebtoken");
const customApiErrors = require("../helpers/customErrors");
const userCollection = require("../model/usersSchema");
let auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return next(customApiErrors("token is required", 403));
    }
    token = token.split(" ")[1];
    let decodedData = jsonwebtoken.verify(token, "sk123");
    console.log(decodedData);
    req.userToken = decodedData.email;
    let verifiedUser = await userCollection.findOne({
      email: decodedData.email,
    });
    if (verifiedUser) {
      next();
    } else {
      throw next(customApiErrors("User not verified", 403));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
