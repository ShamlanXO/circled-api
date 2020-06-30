const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  Title: { type: String, default: null },
  Details: {
    type: String,
    default: null,
  },
  Audience: {
    type: String,
    default: null,
  },

  Priority: {
    type: String,
    default: null,
  },
  ShareFuture: { type: Boolean, default: false },
  ExpiryDate:{ type:Date},
  Attachment:{ type:String},
  CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },


},{timestamps: true});

module.exports = mongoose.model("announcement", AnnouncementSchema);
