const express = require("express");
const NotificationController = require("../controllers/Notification");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth, NotificationController.FetchNotification);
router.route("/new").post(checkAuth, NotificationController.CreateNotification);
router
  .route("/update/:Id")
  .post(checkAuth, NotificationController.UpdateNotification);

router
  .route("/delete/:Id")
  .get(checkAuth, NotificationController.DeleteNotification);
router.route("/count").get(checkAuth, NotificationController.GetUnreadCount)
module.exports = router;
