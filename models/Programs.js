const mongoose = require("mongoose");
const DietPlanSchema = new mongoose.Schema({
 Title:{ type: String,default: null},
 File: { type: String, default: null },
Description:{ type: String, default: null}
});

const ExerciseSchema= new mongoose.Schema({ 
url:{ type: String, default: null},
title:{ type: String, default: null},
reps: { type: Number, default: null},
sets: { type: Number, default: null},
note: { type: String, default: null},
rest: { type: Number, default: null},
banner:{ type: String, default: null},
})


const ExercisePlanSchema = new mongoose.Schema({
Title: { type: String, default: null },
IsRest: {type: Boolean,default: false},
Exercise: [ExerciseSchema],
Cover:{ type: String, default: null }, 
});


const ProgramSchema = new mongoose.Schema(
  {
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    Title: { type: String,default:null},
    Category: [{ type: String}],
    Description:  { type: String,default:null},
    Benifits :{ type: String,default:null},
    ExtraInfo:{ type: String, default: null},
    Requirements:{ type: String, default: null},
    Type:{ type: String, default: null},
    PaymentType:{ type: String},
    Price:{ type:Number},
    Discount:{ type:Number},
    GreetingMessage:{ type:String},
    DietPlan:DietPlanSchema,
    ExercisePlan:[[ExercisePlanSchema]],
   BannerImage:{ type: String,default:null},
   BannerVideo:{ type: String, default: null },
    IsPublished:{type:Boolean, default:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    
  },
  { timestamps: true }
);
module.exports = mongoose.model("program", ProgramSchema);
