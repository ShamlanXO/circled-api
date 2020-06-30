const express = require("express");
const DailyMainsController = require("../controllers/DailyMains");
const router = express.Router();
const checkAuth = require("../middleware/CheckAuth");
router.route("/all").get(checkAuth,DailyMainsController.SearchDailyMains);


router.route("/new").post(checkAuth, DailyMainsController.CreateDailyMains);
router
  .route("/view/:Id")
  .get(checkAuth, DailyMainsController.IncreaseTotalViews);
router
  .route("/update/:Id")
  .put(checkAuth, DailyMainsController.UpdateDailyMains);
router
  .route("/delete/:Id")
  .delete(checkAuth, DailyMainsController.DeleteDailyMains);

router
  .route("/submit-answer/:Id")
  .patch(checkAuth, DailyMainsController.SubmitDailyMainsAnswer);
router
  .route("/assign-evaluator/:Id")
  .patch(checkAuth, DailyMainsController.AssignEvaluator);
router
  .route("/update-answer/:Id")
  .patch(checkAuth, DailyMainsController.UpdateDailyMainsAnswer);

  router
  .route("/update-feedback/:Id")
  .patch(checkAuth, DailyMainsController.UpdateDailyMainsFeedback);


  router
  .route("/update-answer-rejected/:_id")
  .patch(checkAuth, DailyMainsController.UpdateDailyMainsAnswerRejected);

router
  .route("/add-feedback/:Id")
  .patch(checkAuth, DailyMainsController.AddDailyMainsFeedback);
router
  .route("/increase-view")
  .patch(checkAuth, DailyMainsController.IncreaseTotalViews);
router
  .route("/increase-likes")
  .patch(checkAuth, DailyMainsController.IncreaseTotalLikes);

  router
  .route("/decrease-likes")
  .patch(checkAuth, DailyMainsController.DecreaseTotalLikes);

router
  .route("/like-answer")
  .post(checkAuth, DailyMainsController.LikeDailyMainsAnswer);

  router
  .route("/unlike-answer")
  .post(checkAuth, DailyMainsController.UnLikeDailyMainsAnswer);


router
  .route("/fetch-candidate/:Id")
  .get(checkAuth, DailyMainsController.FetchSpecificAnswer);


router.route("/student/:UserId").get(checkAuth, DailyMainsController.FetchStudentMains);

router.route("/student/:UserId/:_id").get(checkAuth, DailyMainsController.FetchIndividualStudentMain);

router
  .route("/delete-answer/:Id")
  .patch(checkAuth, DailyMainsController.DeleteAnswer);
router
  .route("/update-attachment/:Id")
  .patch(checkAuth, DailyMainsController.UpdateDailyMainsAttachment);
router
  .route("/finish-evaluation/:Id")
  .patch(checkAuth, DailyMainsController.FinishDailyMainsEvaluation);
module.exports = router;
