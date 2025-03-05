const express = require("express");
const LibraryRoute = require("../controllers/LibraryV2");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/get").get(LibraryRoute.FetchVideoLibrary);
router.route("/getallvideos").get(checkAuth,LibraryRoute.getAllVideos)
router.route("/updateVideo").put(checkAuth,LibraryRoute.updateVideo)
router.route("/addVideo").post(checkAuth,LibraryRoute.addVideo)
// router.route("/editVideo").post(checkAuth,LibraryRoute.editVideo)
router.route("/savevideotolib").post(checkAuth,LibraryRoute.saveVideoToLibrary)
router.route("/getWorkouts").get(checkAuth,LibraryRoute.getWorkouts)
router.route("/getWorkout/:id").get(LibraryRoute.getWorkout)
router.route("/addworkout").post(checkAuth,LibraryRoute.addWorkout)
router.route("/updateworkout").post(checkAuth,LibraryRoute.updateWorkout)
router.route("/deleteworkout/:id").delete(checkAuth,LibraryRoute.deleteWorkout)
router.route("/getpubliclib").get(checkAuth,LibraryRoute.getPublicVideos)
module.exports = router;
