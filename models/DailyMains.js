const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
  Rating: { type: Number, default: 0 },
  Comment: { type: String, default: null },
  Attachment: { type: String, default: null },
  isPrivate: { type: Boolean, default: false },
  GivenBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});
const answerSchema = new mongoose.Schema({
  SubmittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  Evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  Answer: { type: String, default: null },
  Attachment: [{ type: String, default: null }],
  LikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  AssignedMark: { type: Number, default: null },
  Feedback: [feedbackSchema],
  IsChecked: { type: Boolean, default: false },
  IsRejected: { type: Boolean, default: false },
  ReasonToReject: { type: String, default: null },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

const dailyMainSchema = new mongoose.Schema(
  {
    Evaluators: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    Question: { type: String, default: null },
    QuestionAttachment: [{ type: String, default: null }],
    IsActive: { type: Boolean, default: true },
    IsPublished:{type:Boolean, default:true},
    QuestionPublishDate: { type: Date },
    TotalMarks: { type: Number, default: 0 },
    // QuestionPublishTime: { type: String },
    AnswerPublishDate: { type: Date },
    // AnswerPublishTime: { type: String },
    Subject: [{ type: String, default: null }],
    ViewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    AnswerOutline: { type: String, default: null },
    Share: { type: String, default: "Public" },
    LikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    SubmittedAnswers: [answerSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("daily_mains", dailyMainSchema);
