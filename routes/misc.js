const express = require("express");
const miscController = require("../controllers/misc");
const multer = require("multer");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/generate-hash").get(miscController.generatePasswordHash);
router.route("/generate-token").get(miscController.generateToken);
router
  .route("/upload-single")
  .post(
    multer({ dest: "temp/" }).single("rsfile"),
    miscController.uploadSingleFile
  );
router
  .route("/upload-multiple")
  .post(
    multer({ dest: "temp/" }).array("rsfile"),
    miscController.uploadMultipleFile
  );
router.route("/upload-string").post(miscController.uploadString);
router.route("/download-file").get(miscController.downloadFile);
router.route("/send-mail").post(miscController.SendMail);
router.route("/send-verify-mail").post(miscController.SendVerifyMail);
router.route("/verify-mail").post(miscController.VerifyMail);
router.route("/change-password-mail").post(checkAuth,miscController.ChangePasswordMail);
router.route("/change-password-mail2").post(miscController.ChangePasswordMail2);
module.exports = router;
