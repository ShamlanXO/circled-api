const Candidate = require("../models/Candidate");
const aqp = require("api-query-params");
var ObjectID = require("mongodb").ObjectID;

exports.SearchCandidate = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Candidate.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate("Candidate")
    .populate("TestSet")
    .populate("DailyMains")
    .populate("Evaluator")
    .populate("TestSet.TestSeries")
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No Candidates Found ",
        });
      } else {
        return res.status(200).send({
          message: "Candidates List ",
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

exports.CreateCandidate = (req, res) => {
  const testSetCandidate = new Candidate(req.body);
  testSetCandidate
    .save()
    .then((result) => {
      return res.status(201).send({
        message: "New Candidate Created Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.SubmitMCQTest = (req, res) => {
  Candidate.find({
    Candidate: ObjectID(req.body.Candidate),
    TestSet: ObjectID(req.body.TestSet),
  })
    .populate("TestSet")
    .then((check) => {
      if (check.length > 0) {
        if (check[0].TestSet.MaximumAttempts <= check[0].TotalAttempts) {
          return res.status(409).send({
            message: "Maximum attempt reached",
          });
        } else {
          Candidate.updateOne({ _id: check[0]._id }, req.body)
            .then((updateResult) => {
              Candidate.aggregate([
                { $match: { _id: ObjectID(check[0]._id) } },
                {
                  $lookup: {
                    from: "test_sets",
                    localField: "TestSet",
                    foreignField: "_id",
                    as: "TestSetDetails",
                  },
                },
                { $unwind: "$TestSetDetails" },
                {
                  $addFields: {
                    CheckedQuestions: {
                      $map: {
                        input: "$Answer",
                        as: "ans",
                        in: {
                          $let: {
                            vars: {
                              question: {
                                $arrayElemAt: [
                                  "$TestSetDetails.Questions",
                                  { $subtract: ["$$ans.Question", 1] },
                                ],
                              },
                            },
                            in: {
                              Question: "$$ans.Question",
                              TotalTime: "$$ans.TotalTime",

                              IsAttempted: {
                                $cond: {
                                  if: {
                                    $gt: [{ $size: "$$ans.SelectedOption" }, 0],
                                  },
                                  then: 1,

                                  else: 0,
                                },
                              },

                              IsCorrect: {
                                $cond: [
                                  {
                                    $setEquals: [
                                      "$$ans.SelectedOption",
                                      "$$question.CorrectOption",
                                    ],
                                  },
                                  1,
                                  0,
                                ],
                              },
                              SelectedOption: "$$ans.SelectedOption",

                              AssignedMarks: {
                                $cond: {
                                  if: {
                                    $gt: [{ $size: "$$ans.SelectedOption" }, 0],
                                  },
                                  then: {
                                    $cond: [
                                      {
                                        $setEquals: [
                                          "$$ans.SelectedOption",
                                          "$$question.CorrectOption",
                                        ],
                                      },
                                      "$TestSetDetails.CorrectAnswerMarks",
                                      {
                                        $multiply: [
                                          "$TestSetDetails.NegativeMarking",
                                          -1,
                                        ],
                                      },
                                    ],
                                  },
                                  else: 0,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },

                {
                  $project: {
                    CheckedQuestions: "$CheckedQuestions",
                    TotalTime: { $sum: "$CheckedQuestions.TotalTime" },
                    TotalMarks: { $sum: "$CheckedQuestions.AssignedMarks" },

                    TotalQuestionAttempted: {
                      $sum: "$CheckedQuestions.IsAttempted",
                    },
                    TotalCorrect: { $sum: "$CheckedQuestions.IsCorrect" },
                    Accuracy: {
                      $cond: {
                        if: {
                          $eq: [{ $sum: "$CheckedQuestions.IsAttempted" }, 0],
                        },
                        then: 0,
                        else: {
                          $divide: [
                            { $sum: "$CheckedQuestions.IsCorrect" },
                            { $sum: "$CheckedQuestions.IsAttempted" },
                          ],
                        },
                      },
                    },
                  },
                },
              ])
                .then((result) => {
                  Candidate.updateOne(
                    { _id: check[0]._id },
                    {
                      Answer: result[0].CheckedQuestions,
                      TotalTime: result[0].TotalTime,
                      TotalQuestionAttempted: result[0].TotalQuestionAttempted,
                      TotalCorrect: result[0].TotalCorrect,
                      Accuracy: result[0].Accuracy,
                      TotalScore: result[0].TotalMarks,
                      $inc: { TotalAttempts: 1 },
                      IsInterrupted: false,
                    }
                  ).then((resultUpdate) => {
                    return res.status(200).send({
                      message: "Mcq submitted successfully",
                    });
                  });
                })
                .catch((error) => {
                  return res.status(500).send({ ErrorOccured: error });
                });
            })
            .catch((error) => {
              return res.status(500).send({ ErrorOccured: error });
            });
        }
      } else {
        const testSetCandidate = new Candidate(req.body);
        testSetCandidate
          .save()
          .then((resultCreation) => {
            Candidate.aggregate([
              { $match: { _id: ObjectID(resultCreation._id) } },
              {
                $lookup: {
                  from: "test_sets",
                  localField: "TestSet",
                  foreignField: "_id",
                  as: "TestSetDetails",
                },
              },
              { $unwind: "$TestSetDetails" },
              {
                $addFields: {
                  CheckedQuestions: {
                    $map: {
                      input: "$Answer",
                      as: "ans",
                      in: {
                        $let: {
                          vars: {
                            question: {
                              $arrayElemAt: [
                                "$TestSetDetails.Questions",
                                { $subtract: ["$$ans.Question", 1] },
                              ],
                            },
                          },
                          in: {
                            Question: "$$ans.Question",
                            TotalTime: "$$ans.TotalTime",

                            IsAttempted: {
                              $cond: {
                                if: {
                                  $gt: [{ $size: "$$ans.SelectedOption" }, 0],
                                },
                                then: 1,

                                else: 0,
                              },
                            },

                            IsCorrect: {
                              $cond: [
                                {
                                  $setEquals: [
                                    "$$ans.SelectedOption",
                                    "$$question.CorrectOption",
                                  ],
                                },
                                1,
                                0,
                              ],
                            },
                            SelectedOption: "$$ans.SelectedOption",
                            AssignedMarks: {
                              $cond: {
                                if: {
                                  $gt: [{ $size: "$$ans.SelectedOption" }, 0],
                                },
                                then: {
                                  $cond: [
                                    {
                                      $setEquals: [
                                        "$$ans.SelectedOption",
                                        "$$question.CorrectOption",
                                      ],
                                    },
                                    "$TestSetDetails.CorrectAnswerMarks",
                                    {
                                      $multiply: [
                                        "$TestSetDetails.NegativeMarking",
                                        -1,
                                      ],
                                    },
                                  ],
                                },
                                else: 0,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },

              {
                $project: {
                  CheckedQuestions: "$CheckedQuestions",
                  TotalMarks: { $sum: "$CheckedQuestions.AssignedMarks" },
                  TotalQuestionAttempted: {
                    $sum: "$CheckedQuestions.IsAttempted",
                  },
                  TotalTime: { $sum: "$CheckedQuestions.TotalTime" },
                  TotalCorrect: { $sum: "$CheckedQuestions.IsCorrect" },
                  Accuracy: {
                    $cond: {
                      if: {
                        $eq: [{ $sum: "$CheckedQuestions.IsAttempted" }, 0],
                      },
                      then: 0,
                      else: {
                        $divide: [
                          { $sum: "$CheckedQuestions.IsCorrect" },
                          { $sum: "$CheckedQuestions.IsAttempted" },
                        ],
                      },
                    },
                  },
                },
              },
            ]).then((result) => {
              console.log(result);
              Candidate.updateOne(
                { _id: resultCreation._id },
                {
                  Answer: result[0].CheckedQuestions,
                  TotalQuestionAttempted: result[0].TotalQuestionAttempted,
                  TotalCorrect: result[0].TotalCorrect,
                  Accuracy: result[0].Accuracy,
                  TotalTime: result[0].TotalTime,
                  TotalScore: result[0].TotalMarks,
                  $inc: { TotalAttempts: 1 },
                  IsInterrupted: false,
                }
              ).then((resultUpdate) => {
                return res.status(200).send({
                  message: "Mcq submitted successfully",
                });
              });
            });
          })
          .catch((error) => {
            return res.status(500).send({ ErrorOccured: error });
          });
      }
    });
};

exports.UpdateCandidate = (req, res) => {
  Candidate.updateOne({ _id: req.params.Id }, req.body, function (err, doc) {
    if (err) {
      return res.status(500).send({
        message: "Unable to to update Candidate  ",
        ErrorOccured: err,
      });
    } else {
      return res.status(200).send({
        message: "Candidate  Updated Successfully",
      });
    }
  }).catch((error) => {
    return res.status(500).send({ ErrorOccured: error });
  });
};

exports.UpdateCandidateMCQ = (req, res) => {
  console.log(req.body);
  Candidate.updateOne(
    { Candidate: req.body.Candidate, TestSet: req.body.TestSet },
    req.body,
    { upsert: true },
    function (err, doc) {
      if (err) {
        return res.status(590).send({
          message: "Unable to to update Candidate",
          ErrorOccured: err,
        });
      } else {
        return res.status(200).send({
          message: "Candidate  Updated Successfully",
        });
      }
    }
  ).catch((error) => {
    return res.status(500).send({ ErrorOccured: error });
  });
};

exports.DeleteCandidate = (req, res) => {
  Candidate.findByIdAndRemove(req.params.Id)
    .then((result) => {
      return res.status(200).send({
        message: "Candidate  Deleted Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.EvaluatorDetails = (req, res) => {
  Candidate.aggregate([
    {
      $match: {
        TestSet: ObjectID(req.body.TestSet),
      },
    },
    {
      $group: {
        _id: "$Evaluator",
        totalCopies: { $sum: 1 },
      },
    },
  ])
    .then((result) => {
      return res.status(200).send({
        data: result,
        message: "Candidate  fetch Successfully",
      });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CheckCopy = (req, res) => {
  Candidate.aggregate([
    {
      $match: {
        Candidate: ObjectID("5dee015c2629234ed6c049e0"),
        TestSet: ObjectID("5e4e3579481dc00fc0bf25cd"),
      },
    },
    {
      $lookup: {
        from: "test_sets",
        localField: "TestSet",
        foreignField: "_id",
        as: "TestSetDetails",
      },
    },
    { $unwind: "$TestSetDetails" },
    {
      $addFields: {
        CheckedQuestions: {
          $map: {
            input: "$Answer",
            as: "ans",
            in: {
              $let: {
                vars: {
                  question: {
                    $arrayElemAt: [
                      "$TestSetDetails.Questions",
                      { $subtract: ["$$ans.Question", 1] },
                    ],
                  },
                },
                in: {
                  Question: "$$ans.Question",
                  TotalTime: { $sum: "$CheckedQuestions.TotalTime" },
                  IsAttempted: {
                    $cond: {
                      if: { $gt: [{ $size: "$$ans.SelectedOption" }, 0] },
                      then: 1,

                      else: 0,
                    },
                  },

                  IsCorrect: {
                    $cond: [
                      {
                        $setEquals: [
                          "$$ans.SelectedOption",
                          "$$question.CorrectOption",
                        ],
                      },
                      1,
                      0,
                    ],
                  },

                  SelectedOption: "$$ans.SelectedOption",
                  AssignedMarks: {
                    $cond: {
                      if: { $gt: [{ $size: "$$ans.SelectedOption" }, 0] },
                      then: {
                        $cond: [
                          {
                            $setEquals: [
                              "$$ans.SelectedOption",
                              "$$question.CorrectOption",
                            ],
                          },
                          "$TestSetDetails.CorrectAnswerMarks",
                          "$TestSetDetails.NegativeMarking",
                        ],
                      },
                      else: 0,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    {
      $project: {
        CheckedQuestions: "$CheckedQuestions",
        TotalMarks: { $sum: "$CheckedQuestions.AssignedMarks" },
        TotalQuestionAttempted: { $sum: "$CheckedQuestions.IsAttempted" },
        TotalCorrect: { $sum: "$CheckedQuestions.IsCorrect" },
        TotalTime: { $sum: "$CheckedQuestions.TotalTime" },
        Accuracy: {
          $divide: [
            { $sum: "$CheckedQuestions.IsCorrect" },
            { $sum: "$CheckedQuestions.IsAttempted" },
          ],
        },
      },
    },
  ])
    .then((result) => {
      return res.status(200).send({
        result,
      });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.IndividualReport = (req, res) => {
  Candidate.aggregate([
    { $match: { TestSet: ObjectID(req.params.TestId), IsInterrupted: false } },

    {
      $facet: {
        testDetails: [
          {
            $lookup: {
              from: "users",
              localField: "Candidate",
              foreignField: "_id",
              as: "StudentDetails",
            },
          },
          { $sort: { TotalScore: -1 } },
          {
            $group: {
              _id: null,
              totalStudents: { $sum: 1 },
              averageScore: { $avg: "$TotalScore" },
              averageTime: { $avg: "$TotalTime" },
              averageAccuracy: { $avg: "$Accuracy" },
              averageAttempts: { $avg: "$TotalQuestionAttempted" },
              totalCandidates: { $sum: 1 },
              Topperdata: { $first: "$$ROOT" },
            },
          },
        ],

        ranks: [{ $sort: { TotalScore: -1 } }],

        top10: [
          { $sort: { TotalScore: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "Candidate",
              foreignField: "_id",
              as: "StudentDetails",
            },
          },

          {
            $limit: 10,
          },
          { $unwind: "$StudentDetails" },

          {
            $project: {
              _id: "$_id",
              StudentDetails: {
                FirstName: "$StudentDetails.FirstName",
                LastName: "$StudentDetails.LastName",
                ProfilePicture: "$StudentDetails.ProfilePicture",
              },
              TotalAttempts: "$TotalAttempts",
              TotalQuestionAttempted: "$TotalQuestionAttempted",
              TotalCorrect: "$TotalCorrect",
              TotalScore: "$TotalScore",
              TotalTime: "$TotalTime",
              Accuracy: "$Accuracy",
            },
          },
        ],

        studentDetails: [
          { $match: { Candidate: ObjectID(req.params.UserId) } },
          {
            $lookup: {
              from: "test_sets",
              localField: "TestSet",
              foreignField: "_id",
              as: "TestSetDetails",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "Candidate",
              foreignField: "_id",
              as: "StudentDetails",
            },
          },
        ],

        studentDetails2: [
          { $match: { Candidate: ObjectID(req.params.UserId) } },
        ],

        RANKvsMARKS: [
          { $sort: { TotalScore: -1 } },
          {
            $group: {
              _id: null,
              items: { $push: "$$ROOT" },
            },
          },
          { $unwind: { path: "$items", includeArrayIndex: "items.rank" } },
          { $replaceRoot: { newRoot: "$items" } },
          { $sort: { rank: 1 } },
          {
            $project: {
              marks: "$TotalScore",
              rank: { $add: ["$rank", 1] },
            },
          },

          {
            $bucketAuto: {
              groupBy: "$rank",
              buckets: 10,
              output: {
                marks: { $avg: "$marks" },
              },
            },
          },
        ],

        MARKSvsSTUDENTS: [
          {
            $group: {
              _id: "$TotalScore",
              count: { $sum: 1 },
            },
          },

          {
            $bucketAuto: {
              groupBy: "$_id",
              buckets: 10,
              output: {
                numberOfStudents: { $sum: "$count" },
              },
            },
          },
        ],
        QuestionTime: [
          { $match: { Candidate: ObjectID(req.params.UserId) } },
          { $unwind: "$Answer" },
          {
            $group: {
              _id: { $sum: ["$Answer.IsAttempted", "$Answer.IsCorrect"] },
              TotalTime: { $sum: "$Answer.TotalTime" },
            },
          },
        ],
        QuestionWiseDetails: [
          { $match: { Candidate: ObjectID(req.params.UserId) } },
          { $unwind: "$Answer" },
          {
            $group: {
              _id: "$Answer.Question",
              attempted: { $sum: "$Answer.IsAttempted" },
              correct: { $sum: "$Answer.IsCorrect" },
              accuracy: { $avg: "$Answer.Accuracy" },
              TotalTime: { $avg: "$Answer.TotalTime" },
              minTime: { $min: "$Answer.TotalTime" },
            },
          },
        ],
      },
    },
    {
      $project: {
        studentTestDetails: { $arrayElemAt: ["$studentDetails", 0] },

        Topperdetails: {
          $let: {
            vars: { topper: { $arrayElemAt: ["$testDetails", 0] } },
            in: "$$topper.Topperdata",
          },
        },

        TotalStudents: { $size: "$ranks" },

        Averages: {
          $let: {
            vars: { topper: { $arrayElemAt: ["$testDetails", 0] } },
            in: {
              AverageScore: "$$topper.averageScore",
              AverageAccuracy: "$$topper.averageAccuracy",
              AverageAttempts: "$$topper.averageAttempts",
              AverageTime: "$$topper.averageTime",
            },
          },
        },

        Rank: {
          $add: [
            {
              $indexOfArray: [
                "$ranks",
                { $arrayElemAt: ["$studentDetails2", 0] },
              ],
            },
            1,
          ],
        },

        Top10: "$top10",

        TestDetails: {
          $let: {
            vars: { test: { $arrayElemAt: ["$studentDetails", 0] } },
            in: { $arrayElemAt: ["$$test.TestSetDetails", 0] },
          },
        },

        RANKvsMARKS: "$RANKvsMARKS",
        MARKSvsSTUDENTS: "$MARKSvsSTUDENTS",
        QuestionTime: "$QuestionTime",
        QuestionWiseDetails: "$QuestionWiseDetails",
      },
    },
  ])
    .then((result) => {
      return res.status(200).send({
        result,
      });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.FullReport = (req, res) => {
  Candidate.aggregate([
    { $match: { TestSet: ObjectID(req.params.TestId), IsInterrupted: false } },

    {
      $facet: {
        testDetails: [
          {
            $lookup: {
              from: "users",
              localField: "Candidate",
              foreignField: "_id",
              as: "StudentDetails",
            },
          },
          {
            $lookup: {
              from: "test_sets",
              localField: "TestSet",
              foreignField: "_id",
              as: "TestSetDetails",
            },
          },
          { $sort: { TotalScore: -1 } },
          {
            $group: {
              _id: null,
              totalStudents: { $sum: 1 },
              highestScore: { $max: "$TotalScore" },
              lowestScore: { $min: "$TotalScore" },
              averageScore: { $avg: "$TotalScore" },
              averageAccuracy: { $avg: "$Accuracy" },
              averageTime: { $avg: "$TotalTime" },
              averageAttempts: { $avg: "$TotalQuestionAttempted" },
              totalCandidates: { $sum: 1 },
              TestSetDetails: { $first: "$TestSetDetails" },
            },
          },
        ],
        ranks: [
          { $sort: { TotalScore: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "Candidate",
              foreignField: "_id",
              as: "StudentDetails",
            },
          },

          { $unwind: "$StudentDetails" },

          {
            $project: {
              _id: "$_id",
              StudentDetails: {
                _id: "$StudentDetails._id",
                FirstName: "$StudentDetails.FirstName",
                LastName: "$StudentDetails.LastName",
                ProfilePicture: "$StudentDetails.ProfilePicture",
              },
              TotalAttempts: "$TotalAttempts",
              TotalQuestionAttempted: "$TotalQuestionAttempted",
              TotalCorrect: "$TotalCorrect",
              TotalScore: "$TotalScore",
              TotalTime: "$TotalTime",
              Accuracy: "$Accuracy",
            },
          },
        ],

        top10: [
          { $sort: { TotalScore: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "Candidate",
              foreignField: "_id",
              as: "StudentDetails",
            },
          },

          {
            $limit: 10,
          },
          { $unwind: "$StudentDetails" },

          {
            $project: {
              _id: "$_id",
              StudentDetails: {
                FirstName: "$StudentDetails.FirstName",
                LastName: "$StudentDetails.LastName",
                ProfilePicture: "$StudentDetails.ProfilePicture",
              },
              TotalAttempts: "$TotalAttempts",
              TotalQuestionAttempted: "$TotalQuestionAttempted",
              TotalCorrect: "$TotalCorrect",
              TotalScore: "$TotalScore",
              TotalTime: "$TotalTime",
              Accuracy: "$Accuracy",
            },
          },
        ],

        studentDetails: [
          { $match: { Candidate: ObjectID(req.params.UserId) } },
          {
            $lookup: {
              from: "test_sets",
              localField: "TestSet",
              foreignField: "_id",
              as: "TestSetDetails",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "Candidate",
              foreignField: "_id",
              as: "StudentDetails",
            },
          },
          { $unwind: "$StudentDetails" },

          {
            $project: {
              _id: "$_id",
              StudentDetails: {
                FirstName: "$StudentDetails.FirstName",
                LastName: "$StudentDetails.LastName",
                ProfilePicture: "$StudentDetails.ProfilePicture",
              },
              TestSetDetails: "$TestSetDetails",
              TotalAttempts: "$TotalAttempts",
              TotalQuestionAttempted: "$TotalQuestionAttempted",
              TotalCorrect: "$TotalCorrect",
              TotalScore: "$TotalScore",
              Accuracy: "$Accuracy",
            },
          },
        ],

        QuestionWiseDetails: [
          { $unwind: "$Answer" },
          {
            $group: {
              _id: "$Answer.Question",
              attempted: { $sum: "$Answer.IsAttempted" },
              correct: { $sum: "$Answer.IsCorrect" },
              accuracy: { $avg: "$Answer.Accuracy" },
              TotalTime: { $avg: "$Answer.TotalTime" },
              minTime: { $min: "$Answer.TotalTime" },
            },
          },
        ],

        QuestionDifficulty: [
          { $unwind: "$Answer" },
          {
            $group: {
              _id: "$Answer.Question",
              attempted: { $sum: "$Answer.IsAttempted" },
              correct: { $sum: "$Answer.IsCorrect" },
            },
          },
          {
            $project: {
              _id: "$_id",
              attempted: { $sum: "$attempted" },
              correct: { $sum: "$correct" },
              accuracy: {
                $cond: {
                  if: { $eq: ["$attempted", 0] },
                  then: 0,
                  else: { $divide: ["$correct", "$attempted"] },
                },
              },
            },
          },
          {
            $bucket: {
              groupBy: "$accuracy", // Field to group by
              boundaries: [0, 0.2, 0.4, 0.6, 0.8, 1.01], // Boundaries for the buckets
              default: "other", // Bucket id for documents which do not fall into a bucket
              output: {
                // Output for each bucket
                count: { $sum: 1 },
              },
            },
          },
        ],

        RANKvsMARKS: [
          { $sort: { TotalScore: -1 } },
          {
            $group: {
              _id: null,
              items: { $push: "$$ROOT" },
            },
          },
          { $unwind: { path: "$items", includeArrayIndex: "items.rank" } },
          { $replaceRoot: { newRoot: "$items" } },
          { $sort: { rank: 1 } },
          {
            $project: {
              marks: "$TotalScore",
              rank: { $add: ["$rank", 1] },
            },
          },

          {
            $bucketAuto: {
              groupBy: "$rank",
              buckets: 10,
              output: {
                marks: { $avg: "$marks" },
              },
            },
          },
        ],
        MARKSvsSTUDENTS: [
          {
            $group: {
              _id: "$TotalScore",
              count: { $sum: 1 },
            },
          },

          {
            $bucketAuto: {
              groupBy: "$_id",
              buckets: 10,
              output: {
                numberOfStudents: { $sum: "$count" },
              },
            },
          },
        ],

        StudentPerform: [
          {
            $lookup: {
              from: "test_sets",
              localField: "TestSet",
              foreignField: "_id",
              as: "TestSetDetails",
            },
          },
          { $unwind: "$TestSetDetails" },

          {
            $project: {
              Average: {
                $multiply: [
                  { $divide: ["$TotalScore", "$TestSetDetails.TotalMarks"] },
                  100,
                ],
              },
            },
          },
          {
            $bucket: {
              groupBy: "$Average", // Field to group by
              boundaries: [20, 40, 70, 90, 101], // Boundaries for the buckets
              default: "lessThen20", // Bucket id for documents which do not fall into a bucket
              output: {
                // Output for each bucket
                count: { $sum: 1 },
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        studentTestDetails: { $arrayElemAt: ["$studentDetails", 0] },
        Topperdetails: {
          $let: {
            vars: { topper: { $arrayElemAt: ["$testDetails", 0] } },
            in: "$$topper.Topperdata",
          },
        },

        TestDetails: {
          $let: {
            vars: { test: { $arrayElemAt: ["$testDetails", 0] } },
            in: { $arrayElemAt: ["$$test.TestSetDetails", 0] },
          },
        },

        AllCandidates: "$ranks",

        TotalStudents: { $size: "$ranks" },

        Averages: {
          $let: {
            vars: { topper: { $arrayElemAt: ["$testDetails", 0] } },
            in: {
              AverageScore: "$$topper.averageScore",
              AverageAccuracy: "$$topper.averageAccuracy",
              AverageAttempts: "$$topper.averageAttempts",
              HighestScore: "$$topper.highestScore",
              LowestScore: "$$topper.lowestScore",
              AverageTime: "$$topper.averageTime",
            },
          },
        },

        Top10: "$top10",

        QuestionWiseDetails: "$QuestionWiseDetails",
        RANKvsMARKS: "$RANKvsMARKS",
        MARKSvsSTUDENTS: "$MARKSvsSTUDENTS",
        StudentPerformance: "$StudentPerform",
        QuestionDifficulty: "$QuestionDifficulty",
      },
    },
  ])
    .then((result) => {
      return res.status(200).send({
        result,
      });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
