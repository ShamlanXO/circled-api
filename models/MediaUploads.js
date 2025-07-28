const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  size:{type:Number},
  markedForDeletion:{type:Boolean},
  key:{type:String},
  name:{type:String},
  standalone:{type:Boolean},
  createdAt:{type:Date},
  updatedAt:{type:Date},
  savedToLibrary:{type:Boolean,default:false},
  triggerMuscle: [{ type: String }],
  title:{type:String,default:"unamed"},
  UploadedSuccess:{type:Boolean,default:false},
  TranscodeComplete:{type:Boolean,default:false},
  isDeleted:{type:Boolean,default:false},
},
{ timestamps: true});

module.exports = mongoose.model("uploadlogs", mediaSchema);
