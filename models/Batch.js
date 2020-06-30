const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
  BatchName: { type: String, default: null },
  Centre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "centre",
    required: true
  },
  Course: {
    type: String,
    default: "Classroom Study Course",
    enum: ["Classroom Study Course", "Distance Learning Programme"]
  },
  Exam: {
    type: String,
    default: "CSE Prelims CSAT",
    enum: ["CSE Prelims CSAT", "CSE Prelims GS"]
  },
  BatchType: {
    type: String,
    enum: [
      "Test Series Batch",
      "Weekday Batch",
      "Weekend Batch",
      "Video Series Batch"
    ],
    default: "Test Series Batch"
  }
});

module.exports = mongoose.model("batch", BatchSchema);
