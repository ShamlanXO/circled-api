const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  ReceiverId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  Images:[{type:String}],
  Video:{ type: String,default:null},
  Audio:{ type: String, default: null},
  File:{ type: String,default: null},
  Message: { type: String, default: null },
  SenderId:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
  Link: { type: String, default: null },
  SentProgramId:{ type: mongoose.Schema.Types.ObjectId, ref: "sentprogram"},
  IsRead: { type: Boolean, default: false }
},
{ timestamps: true});

module.exports = mongoose.model("chat", chatSchema);
