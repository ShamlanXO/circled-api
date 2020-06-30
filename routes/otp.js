const express = require("express");
const otpController = require("../controllers/otp");
const router = express.Router();

router.route("/send").get(otpController.SendOTP);
router.route("/verify").get(otpController.VerifyOTP);
router.route("/retry").get(otpController.RetryOTP);
module.exports = router;
