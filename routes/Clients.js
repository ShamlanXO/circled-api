const express = require("express");
const ClientController = require("../controllers/Client");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth, ClientController.getInstructorClient);

module.exports = router;
