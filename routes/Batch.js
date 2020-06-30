const express = require("express");
const BatchRoute = require("../controllers/Batch");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");

router.route("/all").get(checkAuth, BatchRoute.FetchBatch);
router.route("/new").post(checkAuth, BatchRoute.CreateBatch);
router.route("/update/:Id").patch(checkAuth, BatchRoute.UpdateBatch);
router.route("/delete/:Id").delete(checkAuth, BatchRoute.DeleteBatch);
module.exports = router;
