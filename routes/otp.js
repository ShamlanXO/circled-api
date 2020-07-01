const express = require("express");
const otpController = require("../controllers/otp");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/send").get(otpController.SendOTP);
router.route("/verify").get(otpController.VerifyOTP);
router.route("/retry").get(otpController.RetryOTP);
router.route("/SendOTPUpdate").get(checkAuth,otpController.SendOTPUpdate);

module.exports = router;
