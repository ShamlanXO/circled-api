const express = require("express");
const cartRoute = require("../controllers/Cart");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");

router.route("/all").get(checkAuth, cartRoute.FetchCart);
router.route("/new").post(checkAuth, cartRoute.CreateCart);
router.route("/update").post(checkAuth, cartRoute.UpdateCart);
router.route("/delete/:Id").delete(checkAuth, cartRoute.DeleteCart);
module.exports = router;
