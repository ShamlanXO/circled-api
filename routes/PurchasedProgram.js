const express = require("express");
const OrderController = require("../controllers/Orders");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/client").get(checkAuth, OrderController.SearchOrder);

router.route("/get/:id").get(checkAuth, OrderController.GetOrder);
router.route("/new").post(checkAuth, OrderController.CreateOrder);
// router.route("/new").post(checkAuth, OrderController.CreateOrder);
// router.route("/newBulk").post(checkAuth, OrderController.CreateOrderBulk);
router.route("/update/").patch(checkAuth, OrderController.UpdateOrder);
router.route("/updateTodo/").patch(checkAuth, OrderController.UpdateTodo);
router.route("/updateStatus/").patch(checkAuth, OrderController.updateStatus);
router.route("/switchProgram").patch(checkAuth, OrderController.SwitchProgram);
router.route("/allclients").get(checkAuth, OrderController.GetAllClients);
router.route("/getclients").get(checkAuth, OrderController.GetClients);
router
  .route("/getSpecificProgramClient/:id")
  .get(checkAuth, OrderController.GetClientsSpecificProgram);
router
  .route("/getSpecificClient/:Id")
  .get(checkAuth, OrderController.GetSpecificClients);
router.route("/getStats/:id").get(checkAuth, OrderController.GetStats);
// router
//   .route("/check-order")
//   .get(checkAuth, OrderController.CheckOrderExistence);
// router.route("/delete/:Id").delete(checkAuth, OrderController.DeleteOrder);

module.exports = router;
