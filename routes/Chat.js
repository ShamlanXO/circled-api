const express = require("express");
const ChatControllers = require("../controllers/Chat");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
const { route } = require("./user");
router.route("/allLatest").get(checkAuth,ChatControllers.GetChatUsersRecent);
router.route("/getchats").get(checkAuth,ChatControllers.FetchChats);
router.route("/add").post(checkAuth,ChatControllers.CreateChat);
router.route("/getCount").get(checkAuth,ChatControllers.GetUnreadCount)
router.route("/update/:id").patch(checkAuth,ChatControllers.UpdateChat)
module.exports = router;
