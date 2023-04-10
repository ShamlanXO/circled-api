const express = require("express");
const LogController = require("../controllers/ProgressLogs");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");

router.route("/new").post(checkAuth, LogController.CreateLog);
router
  .route("/perticular/:id/:week/:day/:exercise")
  .get(checkAuth, LogController.getPerticularLog);
router.route("/all/:id").get(checkAuth, LogController.getLogHistory);
module.exports = router;
