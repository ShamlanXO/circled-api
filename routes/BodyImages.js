const express = require("express");
const BodyImageRoute = require("../controllers/BodyImages");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/get").get(checkAuth,BodyImageRoute.FetchImages);
router.route("/create").post(checkAuth, BodyImageRoute.CreateImages);
router.route("/update").post(checkAuth, BodyImageRoute.UpdateImages);
router.route("/delete").post(checkAuth, BodyImageRoute.DeleteImages);
module.exports = router;
