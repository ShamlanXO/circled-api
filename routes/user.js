const express = require("express");
const UserController = require("../controllers/user");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(UserController.FetchUser);

router.route("/search/:qry").get(UserController.SearchUser);
router.route("/signup").post(UserController.CreateUser);
router.route("/login").post(UserController.UserLogin);
router.route("/update/").patch(checkAuth, UserController.UserUpdate);
router.route("/updateAuth/").patch(UserController.UserUpdateAuth);
router.route("/check").get(UserController.CheckUserExistence);
router.route("/reset-password").post(checkAuth,UserController.ResetPassword);
router.route("/change-password/").patch(UserController.ChangePassword);
router.route("/change-password-mail").post(UserController.ChangePasswordEmail);
router.route("/delete/:UserId").delete(checkAuth, UserController.DeleteUser);
router.route("/test").post(checkAuth,UserController.SendNotification)
router
  .route("/updateSensitiveData")
  .patch(checkAuth, UserController.UserSensitiveDataUpdate);
router.route("/exists").post(UserController.CheckUser);
module.exports = router;
