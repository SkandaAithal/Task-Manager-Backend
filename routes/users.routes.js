const express = require("express");
const {
  login,
  signup,
  singleuser,
  verifyotp,
} = require("../controllers/users.controller");
const auth = require("../helpers/auth");
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/singleuser", auth, singleuser);
router.post("/verifyotp", verifyotp);

module.exports = router;
