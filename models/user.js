const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {

   uuid:{ type: String},
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
   category:[{ type: String}]
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
