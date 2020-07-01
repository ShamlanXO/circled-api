const express = require("express");
const UserController = require("../controllers/user");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth, UserController.FetchUser);
router.route("/signup").post(UserController.CreateUser);
router.route("/login").post(UserController.UserLogin);
router.route("/update/").patch(checkAuth, UserController.UserUpdate);
router.route("/check").get(UserController.CheckUserExistence);
router.route("/change-password/:Id").patch(UserController.ChangePassword);
router.route("/change-password-mail").post(UserController.ChangePasswordEmail);
router.route("/delete/:UserId").delete(checkAuth, UserController.DeleteUser);
router.route("/updateSensitiveData").patch(checkAuth, UserController.UserSensitiveDataUpdate)
module.exports = router;
