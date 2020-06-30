const mongoose = require("mongoose");

const CourseContent=new mongoose.Schema({

  sectionId:String,
  contentId:String,
  isAttempted:Boolean,
  isCompleted:Boolean,
  testId:{ type:mongoose.Schema.Types.ObjectId, ref: "test_set"},
  testCandidate:{ type:mongoose.Schema.Types.ObjectId, ref: "test_set_candidate"}

})


const courseSchema = new mongoose.Schema(
  {

    Candidate: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    CourseId: {  type: mongoose.Schema.Types.ObjectId, ref: "courses"},
   AttemptList:[CourseContent]

  },
  { timestamps: true }
);
module.exports = mongoose.model("courses_candidate", courseSchema);
