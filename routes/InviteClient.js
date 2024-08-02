const express = require("express");
const InnviteClientController = require("../controllers/InviteClient");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/invite").post(checkAuth, InnviteClientController.InviteClient);
router.route("/resend").post(checkAuth,InnviteClientController.ResendInvite)
router.route("/fetch").get(checkAuth, InnviteClientController.FetchInvitedClientsByUser);
router.route("/fetchInvitations").get(checkAuth, InnviteClientController.FetchInvitations);
router.route("/fetchInvitation/:id").get(InnviteClientController.FetchInvitation);
router.route("/accept/:id").patch(checkAuth, InnviteClientController.AcceptInvitation);
router.route("/reject/:id").delete(checkAuth, InnviteClientController.RejectInvitation);
router.route("/delete/:id").delete(checkAuth,InnviteClientController.DeleteInvitation)
module.exports = router;
