const MailController = require("../controllers/Mail");
const express = require("express");
const router = express.Router();
router.route("/all").get(MailController.FindMail);
router.route("/new").post(MailController.CreateMail);
router.route("/update/:Id").patch(MailController.UpdateMail);
router.route("/delete/:Id").delete(MailController.DeleteMail);

module.exports = router;
