const mongoose = require("mongoose");
const paperStructureSchema = new mongoose.Schema({
  QuestionIndex: { type: Number, default: 0 },
  Question: { type: String, default: null },
  Marks: { type: Number, default: 0 }
});
const QuestionSchema = new mongoose.Schema({
  Question: { type: String, default: null },
  Paragraph: { type: String, default: null },
  Explanation: { type: String, default: null },
  Type: { type: String, enum: ["Normal", "Paragraph"], default: "Normal" },
  Section: { type: String, default: null },
  OptionOne: { type: String, default: null },
  OptionTwo: { type: String, default: null },
  OptionThree: { type: String, default: null },
  Topic: { type: String, default: null },
  OptionFour: { type: String, default: null },
  OptionFive: { type: String, default: null },
  OptionSix: { type: String, default: null },
  CorrectOption: [
    {
      type: String,
      enum: ["One", "Two", "Three", "Four", "Five", "Six", "None"],
      default: "None"
    }
  ],
  AnswerType: { type: String, enum: ["mcq", "text"], default: "mcq" }
});
const practiceTestSetSchema = new mongoose.Schema(
  {
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    TestType: {
      type: String,
      enum: ["MCQ", "Subjective"],
      default: "MCQ"
    },
    IsPublished:{type:Boolean, default:true},
    Title: { type: String },
    TestCategory: {
      type: String,
      enum: ["Exam", "Subject"],
      default: "Subject"
    },

    ExamName: { type: String, default: null },
    SubjectName: { type: String, default: null },
    Topic: { type: String, default: null },
    Share: { type: String, default: "Public" },
    TimeLimit: { type: Number, default: 0 },
    CorrectAnswerMarks: { type: Number, default: 0 },
    NegativeMarking: { type: Number, default:0 },
    Sections: [{ type: String, default: null }],
    TotalMarks: { type: Number, default: 0 },
    FirstLanguage: { type: String, default: "English" },
    SecondLanguage: { type: String, default: "Hindi" },
    PaperStructure: [paperStructureSchema],
    OMRData: { type: String, default: null },
    AllowGuests: { type: Boolean, default: false },
    AverageAccuracy: { type: Number, default: 0 },
    ShuffleQuestions: { type: Boolean, default: false },
    ShuffleOptions: { type: Boolean, default: false },
    PaymentType: { type: String, enum: ["Free", "Paid"], default: "Free" },
    TotalViews: { type: Number, default: 0 },
    RevealAnswers: { type: Boolean, default: true },
    ALlowMultipleAttempts: { type: Boolean, default: false },
    MaximumAttempts: { type: Number, default: 0 },
    PublishTime: {
      type: String,
      enum: ["Now", "Later","Draft"],
      default: "Now"
    },
    StartDate: { type: String, default: null },
    StartTime: { type: String, default: null },
    EndDate: { type: String, default: null },
    EndTime: { type: String, default: null },
    ReportDate: { type: String, default: null },
    ReportTime: { type: String, default: null },
    ReportReleaseTime: {
      type: String,
      enum: ["Now", "Later"],
      default: "Now"
    },
    Questions: [QuestionSchema],
    ModelAnswer:{type:String,default:null},
    QuestionAttachment: [{ type: String, default: null }]
  },
  { timestamps: true }
);
module.exports = mongoose.model("test_set", practiceTestSetSchema);
