const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose);
const paperStructureSchema = new mongoose.Schema({
  QuestionIndex: { type: Number, default: 0 },
  Marks: { type: Number, default: 0 },
  Question: { type: String, default: null },
  AssignedMarks: { type: Number, default: 0 }
});
const CandidateAnswerSchema = new mongoose.Schema({
  Question: { type: Number, default: 0 },
  SelectedOption: [
    {
      type: String,
      enum: ["One", "Two", "Three", "Four", "Five", "Six", "None"],
      default: "None"
    }
  ],
  Attachment: { type: String, default: null },
  Text: { type: String, default: null },
  TotalMarks: { type: Number, default: 0 },
  IsCorrect: { type: Number, default: null },
  AssignedMarks: { type: Number, default: 0 },
  IsAttempted: { type: Number, default: null },
  TotalTime: { type: Number, default: 0 }
});
const CandidateSchema = new mongoose.Schema(
  {
    Candidate: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    TestSet: { type: mongoose.Schema.Types.ObjectId, ref: "test_set" },
    PaperStructure: [paperStructureSchema],
    DailyMains: { type: mongoose.Schema.Types.ObjectId, ref: "daily_mains" },
    Answer: [CandidateAnswerSchema],
    TestType: {
      type: String,
      enum: ["TestSet", "TestSeries", "DailyMains"]
    },
    TotalAttempts:{ type: Number, default: 0},
    TotalQuestionAttempted:{ type: Number, default:0},
    TotalCorrect:{ type: Number, default: 0},
    TotalScore:{ type: Number, default: 0},
    TotalTime:{ type: Number, default: 0},
    Accuracy:{ type: Float, default:null},
    AnswerPdf:{ type: String, default:null},
    IsInterrupted:{ type: Boolean, default:false},
    IsTestPassed: { type: Boolean },
    ReasonToReject: { type: String, default: null },
    Evaluator: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    Attachment: [{ type: String, default: null }],
    Status: {
      type: String,
      enum: [
        "Result Pending",
        "Result Published",
        "Rejected",
        "Evaluator Assigned"
      ],
      default: "Result Pending"
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("test_set_candidate", CandidateSchema);
