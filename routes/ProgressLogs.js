const express = require("express");
const LogController = require("../controllers/ProgressLogs");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");

router.route("/new").post(checkAuth, LogController.CreateLog);
router
  .route("/perticular/:id/:week/:day/:exercise")
  .get(checkAuth, LogController.getPerticularLog);
router.route("/all/:id").get(checkAuth, LogController.getLogHistory);
router.route("/markasread").put(checkAuth, LogController.markAsRead);
router.route("/getUnreadCount/:id").get(checkAuth, LogController.getUnreadCount);
router.route("/:id").delete(checkAuth, LogController.deleteLog)
module.exports = router;
