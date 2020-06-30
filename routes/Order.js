const express = require("express");
const OrderController = require("../controllers/Orders");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth, OrderController.SearchOrder);

router.route("/get").get(checkAuth, OrderController.GetOrder)
router.route("/new").post(checkAuth, OrderController.CreateOrder);
router.route("/newBulk").post(checkAuth, OrderController.CreateOrderBulk);
router.route("/update/:Id").patch(checkAuth, OrderController.UpdateOrder);
router
  .route("/check-order")
  .get(checkAuth, OrderController.CheckOrderExistence);
router.route("/delete/:Id").delete(checkAuth, OrderController.DeleteOrder);

module.exports = router;
