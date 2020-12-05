const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {

   uuid:{ type: String},
   figgsId:{ type: String},
   type:{ type: String},
    email: { type: String,unique:true,sparse: true},
    password: { type: String },
    name: { type: String, default: null },
    bio: { type: String, default: null },
phone:{ type: String,unique:true,sparse: true},
  DOB:{ type: Date, default: null},
    isActive: { type:Boolean,default:true},
    location: { type: String},
   profilePic:{ type: String},
   banner:{ type: String},
   privatePlan:{type:Boolean},
   gender:{ type: String},
   privatePlanMessage:{type:String},
   category:[{ type: String}],
   expertise:{ type: String,default:null},
   healthGoals:{ type: String,default:null},
   healthInfo:{
    height:{ type: String,default:null},
    weight:{ type: String,default:null},
    blood:{ type: String,default:null},
    bodyFat:{ type: String,default:null},
    medicalCondition:{ type: String,default:null},
    medicalNotes:{ type: String,default:null},
    allergiesAndReactions:{ type: String,default:null},
    medications:{ type: String,default:null},
    healthDocuments:[{ type: String}]
   },
   bodyImages:[{ type: String}],
   links:[{ type: String}]
  },
  { timestamps: true }
);
userSchema.index({name:'text',bio:'text',category:'text'})
module.exports = mongoose.model("user", userSchema);
