const mongoose = require("mongoose");


const feedSchema = new mongoose.Schema(
  {
   Title:{ type: String,default:""},
    
    Type:{ type: String,default:""},
   TestSeries:{type:mongoose.Schema.Types.ObjectId, ref: "test_series"},
   StudyMaterial:{type:mongoose.Schema.Types.ObjectId, ref:"study_materials"},
   TestSet:{type:mongoose.Schema.Types.ObjectId, ref:"test_sets"},
   DailyMains:{type:mongoose.Schema.Types.ObjectId, ref:"daily_mains"},
   Announcement:{type:mongoose.Schema.Types.ObjectId, ref:"announcements"},
   StartDate:{type:Date,default:new Date() },
   IsPublished: { type: Boolean, default: true },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("feed", feedSchema);
