const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  Title: { type: String, default: null },
  Type:{ type: String, default: "Admin"},
  Description: { type: String, default: null },
  Link: { type: String, default: null },
  IsRead: { type: Boolean, default: false }
},
{ timestamps: true});

module.exports = mongoose.model("notification", notificationSchema);
