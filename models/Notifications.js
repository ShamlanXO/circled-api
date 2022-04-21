const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  To:[{type:String}],
  Title: { type: String, default: null },
  Sender:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
  Type:{ type: String, default: "Personel"},
  Description: { type: String, default: null },
  Link: { type: String, default: null },
  SentProgramId:{ type: mongoose.Schema.Types.ObjectId, ref: "sentprogram"},
  IsRead: { type: Boolean, default: false }
},
{ timestamps: true});

module.exports = mongoose.model("notification", notificationSchema);
