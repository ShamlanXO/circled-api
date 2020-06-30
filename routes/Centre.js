const express = require("express");
const CentreRoute = require("../controllers/Centre");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");

router.route("/all").get(checkAuth, CentreRoute.FetchCentre);
router.route("/new").post(checkAuth, CentreRoute.CreateCentre);
router.route("/update/:Id").patch(checkAuth, CentreRoute.UpdateCentre);
router.route("/delete/:Id").delete(checkAuth, CentreRoute.DeleteCentre);
module.exports = router;
