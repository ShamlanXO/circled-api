const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
const FAQ = new mongoose.Schema({
  Question: { type: String, default: null },
  Answer: { type: String, default: null },
});

const Anouncement = new mongoose.Schema({
  Title: { type: String },
  Details: { type: String },
});

const Rating = new mongoose.Schema({
  Review: { type: String, default: 0 },
  Score:{ type: Number, default: 0},
  user: { type: mongoose.Schema.Types.ObjectId, default: null },
});
const CourseContent=new mongoose.Schema({
  id:{type:Number, default: 0 }, 
  edit:Boolean,
  type:String,
  lectureDescription:String,
  title:String,
  quizId:mongoose.Schema.Types.ObjectId, 
  video:String,
  article:String,
  assignment:String,

})
const CouseSection=new mongoose.Schema({
  id:Number, 
  title:String,
  content:[CourseContent],
   edit:Boolean})

const courseSchema = new mongoose.Schema(
  {
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    IsPublished: { type: Boolean, default: true },
    CoverImage: { type: String, default: "" },
    Title: { type: String },
    Category: {
      type: String,
     
    },
    FAQ: [FAQ],
    Rating:[Rating],
    Level: { type: String, default: null },

    Description: { type: String, default: null },
    Announcement: {type: String, default: null},
  Lectures:{ type: Number, default: 0 },
    Duration: { type: Number, default: 0 },
    Video: { type: Number, default: 0 },
    Courses:[CouseSection],
   ActualPrice:{ type: Number, default:0},
   SellingPrice:{ type: Number, default:0},
    TotalViews: { type: Number, default: 0 },
    PublishTime: {
      type: String,
      enum: ["Now", "Later", "Draft"],
      default: "Now",
    },
    StartDate: { type: String, default: null },

    EndDate: { type: String, default: null },

  },
  { timestamps: true }
);
module.exports = mongoose.model("courses", courseSchema);
