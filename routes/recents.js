const express = require("express");
const RecentController = require("../controllers/RecentController");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all/:id").get(checkAuth, RecentController.getRecents);

module.exports = router;
