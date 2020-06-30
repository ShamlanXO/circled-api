const StudyMaterial = require("../models/StudyMaterial");
const aqp = require("api-query-params");
const moment = require("moment");
const User = require("../models/user");
const {CreateImplicitFeed}=require("./Feed.js")
var ObjectID = require("mongodb").ObjectID;

exports.FetchSpecificAnswer = (req, res) => {
  DailyMains.find(
    { "SubmittedAnswers._id": req.params.Id },
    {
      Evaluators: "$Evaluators",
      Question: "$Question",
      QuestionAttachment: "$QuestionAttachment",
      IsActive: "$IsActive",
      QuestionPublishDate: "$QuestionPublishDate",
      TotalMarks: "$TotalMarks",
      AnswerPublishDate: "$AnswerPublishDate",
      Subject: "$Subject",
      ViewedBy: "$ViewedBy",
      AnswerOutline: "$AnswerOutline",
      Share: "$Share",
      LikedBy: "$LikedBy",
      CreatedBy: "$CreatedBy",
      SubmittedAnswers: { $elemMatch: { _id: req.params.Id } },
    }
  )
    .populate({
      path: "SubmittedAnswers.SubmittedBy",
      model: "user",
    })
    .populate({
      path: "SubmittedAnswers.Feedback.GivenBy",
      model: "user",
    })
    .populate({
      path: "SubmittedAnswers.Evaluator",
      model: "user",
    })
    .populate("CreatedBy")
    .then((result) => {
      return res
        .status(200)
        .send({ message: "Candidate Details", ServerResponse: result });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.SearchMaterial = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  StudyMaterial.find({ ...filter })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select(projection)
    .populate({
      path: "Comments.SubmittedBy",
      model: "user",
    })
    .populate({
        path: "Comments.Feedback.GivenBy",
        model: "user",
      })
    
    .populate("CreatedBy")
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No Data found for  query",
        });
      } else {
        return res.status(200).send({
          message: " Search Result",
          ServerResponse: result,
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.CreateStudyMaterial = (req, res) => {
  const dailyMains = new StudyMaterial(req.body);
  dailyMains
    .save()
    .then((result) => {
      CreateImplicitFeed({StudyMaterial:result._id,Type:"StudyMaterial"})
      return res
        .status(201)
        .send({ message: "Study Material Created", id: result._id });
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};


exports.UpdateStudyMaterial = (req, res) => {
  StudyMaterial.updateOne({ _id: req.params.Id }, req.body, function (err, doc) {
    if (err) {
      return res.status(500).send({
        ErrorOccured: error,
      });
    }
    if (doc) {
      return res.status(200).send({ message: "Study Material Updated" });
    }
  }).catch((error) => {
    return res.status(500).send({
      ErrorOccured: error,
    });
  });
};

exports.DeleteStudyMaterial = (req, res) => {
  StudyMaterial.findByIdAndRemove(req.params.Id)
    .then((result) => {
      return res.status(200).send({ message: "Study Material Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

// exports.IncreaseTotalViews = (req, res) => {
//   DailyMains.find({ ViewedBy: req.query.UserId, _id: req.query.DailyMainsId })
//     .then((result) => {
//       if (result.length > 0) {
//         return res.status(409).send({ message: "User exists in View" });
//       } else {
//         DailyMains.update(
//           { _id: req.query.DailyMainsId },
//           { $push: { ViewedBy: req.body.ViewedBy } }
//         )
//           .then((result) => {
//             return res.status(200).send({ message: "User Viewed DM" });
//           })
//           .catch((error) => {
//             return res.status(500).send({ ErrorOccured: error });
//           });
//       }
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

exports.IncreaseTotalLikes = (req, res) => {
  StudyMaterial.updateOne(
    {
      _id: req.body.StudyMaterialId,
    },
    { $addToSet: { LikedBy: req.body.userId } }
  )
    .then((result) => {
      res.status(200).send({ Message: "Liked", result });
    })
    .catch((error) => {
      res.status(500).send({ ErrorOccured: error });
    });
};

exports.DecreaseTotalLikes = (req, res) => {
  StudyMaterial.updateOne(
    {
      _id: req.body.StudyMaterialId,
    },
    { $pull: { LikedBy: req.body.userId } }
  )
    .then((result) => {
      res.status(200).send({ Message: "Disliked", result });
    })
    .catch((error) => {
      res.status(500).send({ ErrorOccured: error });
    });
};

exports.SubmitComment = (req, res) => {
  let _id=new ObjectID()
  StudyMaterial.updateOne(
    { _id: req.params.Id },

    { $addToSet: { Comments: {...req.body,_id} } },
    function (err, doc) {
      if (doc)
        return res.status(200).send({ message: "comment Submitted",_id:_id });
      
    }
  ).catch((error) => {
    return res
      .status(500)
      .send({ mesage: "Error Submitting the answer", ErrorOccured: err });
  });
};

exports.UpdateComment = (req, res) => {
  StudyMaterial.updateOne(
    { "Comments._id": req.params.Id},
    {
      $set: {
        "Comments.$.Message": req.body.Message,
        "Comments.$.Attachment": req.body.Attachment,
      },
    }
  )
    .then((result) => {
      if (result.nModified > 0)
        return res.status(200).send({ message: "Answer Updated", result });
      else return res.status(409).send({ message: "You can edit only once" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

// exports.UpdateDailyMainsFeedback = (req, res) => {
//   DailyMains.update(
//     { "SubmittedAnswers.Feedback._id": req.params.Id },
//     {
//       $set: {
//         "SubmittedAnswers.$[].Feedback.$[element].Comment": req.body.Comment,
//         "SubmittedAnswers.$[].Feedback.$[element].Rating": req.body.Rating,
//         "SubmittedAnswers.$[].Feedback.$[element].Attachment":
//           req.body.Attachment,
//         "SubmittedAnswers.$[].Feedback.$[element].isPrivate":
//           req.body.isPrivate,
//       },
//     },
//     { arrayFilters: [{ "element._id": req.params.Id }] }
//   )
//     .then((result) => {
//       return res.status(200).send({ message: "Feedback Updated", result });
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.UpdateDailyMainsAnswerRejected = (req, res) => {
//   DailyMains.update(
//     {
//       _id: req.params._id,
//       "SubmittedAnswers.SubmittedBy": req.body.SubmittedBy,
//       "SubmittedAnswers.Attempts": 1,
//     },
//     {
//       $set: { SubmittedAnswers: { ...req.body, Attempts: 2 } },
//     }
//   )
//     .then((result) => {
//       if (result.nModified > 0)
//         return res.status(200).send({ message: "Answer Updated", result });
//       else return res.status(409).send({ message: "You can edit only once" });
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.UpdateDailyMainsAttachment = (req, res) => {
//   DailyMains.update(
//     { "SubmittedAnswers._id": req.params.Id },
//     {
//       $set: {
//         "SubmittedAnswers.$.Attachment": req.body.Attachment,
//         "SubmittedAnswers.$.IsChecked": req.body.IsChecked,
//       },
//     }
//   )
//     .then((result) => {
//       return res.status(200).send({ Message: "Attachment Updated", result });
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.FinishDailyMainsEvaluation = (req, res) => {
//   DailyMains.update(
//     { "SubmittedAnswers._id": req.params.Id },
//     {
//       "SubmittedAnswers.$.Attachment": req.body.Attachment,
//       "SubmittedAnswers.$.AssignedMark": req.body.AssignedMark,
//       "SubmittedAnswers.$.IsRejected": req.body.IsRejected,
//       "SubmittedAnswers.$.ReasonToReject": req.body.ReasonToReject,
//       "SubmittedAnswers.$.IsChecked": req.body.IsChecked,
//     }
//   )
//     .then((result) => {
//       return res.status(200).send({ Message: "Evaluation Completed", result });
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.AssignEvaluator = (req, res) => {
//   DailyMains.update(
//     { "SubmittedAnswers._id": req.params.Id },
//     {
//       $set: { "SubmittedAnswers.$.Evaluator": req.body.Evaluator },
//     }
//   )
//     .then((result) => {
//       return res.status(200).send({ message: "Evaluator Assigned", result });
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.AddDailyMainsFeedback = (req, res) => {
//   DailyMains.update(
//     { "SubmittedAnswers._id": req.params.Id },
//     {
//       $push: { "SubmittedAnswers.$.Feedback": req.body },
//     }
//   )
//     .then((result) => {
//       return res
//         .status(200)
//         .send({ message: "Feedback Added", ServerResponse: result });
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

exports.LikeComment = (req, res) => {
  StudyMaterial.updateOne(
    {
      "Comments._id": req.body._id,
    },
    { $addToSet: { "Comments.$.LikedBy": req.body.LikedBy } }
  )
    .then((result) => {
      if(result.nModified > 0)
      res.status(200).send({ Message: "Liked", result });
      else
      res.status(500).send({ ErrorOccured: "no change" });
    })
    .catch((error) => {
      res.status(500).send({ ErrorOccured: error });
    });
};

exports.UnLikeComment = (req, res) => {
  StudyMaterial.updateOne(
    {
      "Comments._id": req.body._id,
    },
    { $pull: { "Comments.$.LikedBy": req.body.LikedBy } }
  )
    .then((result) => {
      if(result.nModified>0)
      res.status(200).send({ Message: "DisLiked", result });
     else
     res.status(500).send({ ErrorOccured: "no change" });
    })
    .catch((error) => {
      res.status(500).send({ ErrorOccured: error });
    });
};

// exports.LikeDailyMainsComment = (req, res) => {
//   StudyMaterial.updateOne(
//     {
//       "SubmittedAnswers.Feedback._id": req.query.FeedbackId,
//     },
//     { $addToSet: { "SubmittedAnswers.Feedback.$.LikedBy": req.body.LikedBy } }
//   )
//     .then((result) => {
//       res.status(200).send({ Message: "Liked", result });
//     })
//     .catch((error) => {
//       res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.UnLikeDailyMainsComment = (req, res) => {
//   StudyMaterial.updateOne(
//     {
//       "SubmittedAnswers.Feedback._id": req.query.FeedbackId,
//     },
//     { $pull: { "SubmittedAnswers.Feedback.$.LikedBy": req.body.LikedBy } }
//   )
//     .then((result) => {
//       res.status(200).send({ Message: "DisLiked", result });
//     })
//     .catch((error) => {
//       res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.FetchStudentMains = (req, res) => {
//   DailyMains.aggregate([
//     { $match: { QuestionPublishDate: { $lte: new Date() } } },
//     { $sort: { QuestionPublishDate: -1 } },

//     {
//       $project: {
//         Evaluators: "$Evaluators",
//         Question: "$Question",
//         QuestionAttachment: "$QuestionAttachment",
//         IsActive: "$IsActive",
//         QuestionPublishDate: "$QuestionPublishDate",
//         TotalMarks: "$TotalMarks",
//         AnswerPublishDate: "$AnswerPublishDate",
//         Subject: "$Subject",
//         ViewedBy: "$ViewedBy",
//         AnswerOutline: {
//           $cond: {
//             if: { $lte: ["$AnswerPublishDate", new Date()] },
//             then: "$AnswerOutline",
//             else: "$$REMOVE",
//           },
//         },
//         Share: "$Share",
//         LikedBy: "$LikedBy",
//         CreatedBy: "$CreatedBy",
//         SubmittedAnswers: {
//           $filter: {
//             input: "$SubmittedAnswers",
//             as: "item",
//             cond: {
//               $or: [
//                 { $eq: ["$$item.SubmittedBy", ObjectID(req.params.UserId)] },
//                 { $eq: ["$$item.IsRejected", false] },
//               ],
//             },
//           },
//         },
//         createdAt: "$createdAt",
//         updatedAt: "$updatedAt",
//       },
//     },

//     {
//       $lookup: {
//         from: "user",
//         localField: "SubmittedAnswers.SubmittedBy",
//         foreignField: "_id",
//         as: "SubmittedAnswersAr",
//       },
//     },
//   ])
//     .then((result) => {
//       if (result.length < 1) {
//         return res.status(404).send({ Message: "No Daily Mains Found" });
//       } else {
//         User.populate(
//           result,
//           [
//             { path: "SubmittedAnswers.SubmittedBy" },
//             { path: "SubmittedAnswers.Evaluator" },
//             { path: "SubmittedAnswers.Feedback.GivenBy" },
//             { path: "CreatedBy" },
//           ],
//           function (err, result2) {
//             return res
//               .status(200)
//               .send({ message: "Daily Mains", ServerResponse: result2 });
//           }
//         );
//       }
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.FetchIndividualStudentMain = (req, res) => {
//   DailyMains.aggregate([
//     {
//       $match: {
//         QuestionPublishDate: { $lte: new Date() },
//         _id: ObjectID(req.params._id),
//       },
//     },
//     { $sort: { QuestionPublishDate: -1 } },

//     {
//       $project: {
//         Evaluators: "$Evaluators",
//         Question: "$Question",
//         QuestionAttachment: "$QuestionAttachment",
//         IsActive: "$IsActive",
//         QuestionPublishDate: "$QuestionPublishDate",
//         TotalMarks: "$TotalMarks",
//         AnswerPublishDate: "$AnswerPublishDate",
//         Subject: "$Subject",
//         ViewedBy: "$ViewedBy",
//         AnswerOutline: {
//           $cond: {
//             if: { $lte: ["$AnswerPublishDate", new Date()] },
//             then: "$AnswerOutline",
//             else: "$$REMOVE",
//           },
//         },
//         Share: "$Share",
//         LikedBy: "$LikedBy",
//         CreatedBy: "$CreatedBy",
//         SubmittedAnswers: {
//           $filter: {
//             input: "$SubmittedAnswers",
//             as: "item",
//             cond: {
//               $or: [
//                 { $eq: ["$$item.SubmittedBy", ObjectID(req.params.UserId)] },
//                 { $eq: ["$$item.IsRejected", false] },
//               ],
//             },
//           },
//         },
//         createdAt: "$createdAt",
//         updatedAt: "$updatedAt",
//       },
//     },

//     {
//       $lookup: {
//         from: "user",
//         localField: "SubmittedAnswers.SubmittedBy",
//         foreignField: "_id",
//         as: "SubmittedAnswersAr",
//       },
//     },
//   ])
//     .then((result) => {
//       if (result.length < 1) {
//         return res.status(404).send({ Message: "No Daily Mains Found" });
//       } else {
//         User.populate(
//           result,
//           [
//             { path: "SubmittedAnswers.SubmittedBy" },
//             { path: "SubmittedAnswers.Evaluator" },
//             { path: "SubmittedAnswers.Feedback.GivenBy" },
//             { path: "CreatedBy" },
//           ],
//           function (err, result2) {
//             return res
//               .status(200)
//               .send({ message: "Daily Mains", ServerResponse: result2 });
//           }
//         );
//       }
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.UpdateDailyMainsAnswer = (req, res) => {
//   DailyMains.update(
//     { "SubmittedAnswers._id": req.params.Id },
//     {
//       $set: { "SubmittedAnswers.$[element]": req.body }
//     },
//     {
//       arrayFilters: [{ "element.SubmittedBy": ObjectID(req.query.UserId) }]
//     }
//   )
//     .then(result => {
//       return res.status(200).send({ message: "Answer Updated" });
//     })
//     .catch(error => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

exports.DeleteComment = (req, res) => {
  StudyMaterial.updateOne(
    { "Comments._id": req.params.Id },
    {
      $pull: { Comments: { _id: req.params.Id } },
    }
  )
    .then((result) => {
      return res.status(200).send({ message: "comment Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

// exports.DeleteReply = (req, res) => {
//   console.log(req.params);
//   DailyMains.updateOne(
//     { "SubmittedAnswers.Feedback._id": req.params.Id },
//     {
//       $pull: { "SubmittedAnswers.$.Feedback": { _id: req.params.Id } },
//     }
//   )
//     .then((result) => {
//       return res.status(200).send({ message: "comment Deleted" });
//     })
//     .catch((error) => {
//       console.log(error);
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };
