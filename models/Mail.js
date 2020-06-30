const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema({
  To: { type: String, default: null },
  From: { type: String, default: null },
  Subject: { type: String, default: null },
  Body: { type: String, default: null },
  Status: { type: String, enum: ["Delivered", "Pending"] }
});

module.exports = mongoose.model("mail", mailSchema);
