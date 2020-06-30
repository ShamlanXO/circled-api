const express = require("express");
const PaymentController = require("../controllers/Payments");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth, PaymentController.FindPayment);
router.route("/new").post(checkAuth, PaymentController.CreatePayment);
router.route("/update/:Id").patch(checkAuth, PaymentController.UpdatePayment);
router.route("/delete/:Id").delete(checkAuth, PaymentController.DeletePayment);

module.exports = router;
