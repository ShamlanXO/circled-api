const express = require("express");
const PaymentController = require("../controllers/Payments");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/createSubscription").post(checkAuth,PaymentController.createSubscription);
router.route("/approveSubscription").post(checkAuth,PaymentController.ApproveSubscription)
router.route("/createOrder").post(checkAuth,PaymentController.createOrder);
router.route("/approveOrder").post(checkAuth,PaymentController.ApproveOrder)
router.route("/addFreeOrder").post(checkAuth,PaymentController.AddFreeOrder)
router.route("/checkIfOrderExists").post(checkAuth,PaymentController.checkIfOrderExists)
router.route("/unsubscribe").post(checkAuth,PaymentController.Unsubscribe)
// router.route("/createOrder").post(PaymentController.createOrder);


// router.route("/cancelSubscription").get(PaymentController.cancelSubscription);
// router.route("/paymentFailedSubscription").get(PaymentController.paymentFailedSubscription);
// router.route("/CapturePayment").get(PaymentController.capturePayment);

router.route("/stripe-customer").get(checkAuth,PaymentController.getStripeCustomer)
router.route("/add-payment-method").post(checkAuth,PaymentController.addPaymentMethod)
router.route("/set-default-payment-method").post(checkAuth,PaymentController.setdefaultPaymentMethos)
router.route("/remove-payment-method").post(checkAuth,PaymentController.removePaymentMethod)
module.exports = router;
