const express = require("express");
const Candidate = require("../controllers/Candidate");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth, Candidate.SearchCandidate);
router.route("/new").post(checkAuth, Candidate.CreateCandidate);
router.route("/update/:Id").patch(checkAuth, Candidate.UpdateCandidate);
router.route("/delete/:Id").delete(checkAuth, Candidate.DeleteCandidate);
router.route("/check").get(Candidate.CheckCopy);
router.route("/submitmcqtest").post(Candidate.SubmitMCQTest)
router.route("/reportIndividual/:TestId/:UserId").get(Candidate.IndividualReport)
router.route("/FullReport/:TestId/:UserId").get(Candidate.FullReport)
router.route("/backupTest").post(Candidate.UpdateCandidateMCQ)
router.route("/EvaluatorCopyDetails").post(Candidate.EvaluatorDetails)
module.exports = router;
