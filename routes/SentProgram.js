const express = require("express");
const SentProgramController = require("../controllers/SentProgram");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");


router.route("/get/:id").get(checkAuth, SentProgramController.GetProgram);
router.route("/addProgram/:id").post(checkAuth, SentProgramController.AddProgram)
router.route("/sharedProgramId/:id").post(checkAuth, SentProgramController.SharedProgramId)

// router
//   .route("/check-order")
//   .get(checkAuth, OrderController.CheckOrderExistence);
// router.route("/delete/:Id").delete(checkAuth, OrderController.DeleteOrder);

module.exports = router;
