const express = require("express");
const testSeries = require("../controllers/TestSeries");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth, testSeries.SearchTestSeries);
router.route("/new").post(checkAuth, testSeries.CreateTestSeries);
router.route("/update/:Id").patch(checkAuth, testSeries.UpdateTestSeries);
router.route("/delete/:Id").delete(checkAuth, testSeries.DeleteTestSeries);
router.route("/GetTestSeriesUnperchased").post(testSeries.GetTestSeriesUnperchased)
module.exports = router;
