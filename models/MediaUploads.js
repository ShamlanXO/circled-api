const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
size:{type:Number},
markedForDeletion:{type:Boolean},
  key:{type:String},
  createdAt:{type:Date},
  updatedAt:{type:Date},
},
{ timestamps: true});

module.exports = mongoose.model("uploadlogs", mediaSchema);
