const express = require("express");
const PracticeTestSet = require("../controllers/TestSet");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth, PracticeTestSet.SearchPTS);
router.route("/new").post(checkAuth, PracticeTestSet.CreatePTS);
router.route("/update/:Id").patch(checkAuth, PracticeTestSet.UpdatePTS);
router.route("/delete/:Id").delete(checkAuth, PracticeTestSet.DeletePTS);
module.exports = router;
