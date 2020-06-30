const mongoose = require("mongoose");

const testSeriesSchema = new mongoose.Schema(
  {
    Title: { type: String, default: null },
    Description: { type: String, default: null },
    Category: { type: String, enum: ["Subject", "Exam"], default: "Subject" },
    ExamName: { type: String, default: null },
    SubjectName: { type: String, default: null },
    SubjectTopic: { type: String, default: null },
    Share: { type: String, default: "Public" },
    PaymentType: { type: String, enum: ["Free", "Paid"], default: "Paid" },
    ActualPrice: { type: Number, default: null },
    MembersPrice: { type: Number, default: null },
    NonMembersPrice: { type: Number, default: null },
    StartDate: { type: String, default: null },
    StartTime: { type: String, default: null },
    EndDate: { type: String, default: null },
    EndTime: { type: String, default: null },
    SubscribedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    SeriesType: {
      type: String,
      enum: ["Prelims", "Mains"],
      default: "Prelims"
    },
    TotalTests: { type: Number, default: 0 },
    Tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "test_set" }],
    Disable: { type:Boolean, default: false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("test_series", testSeriesSchema);
