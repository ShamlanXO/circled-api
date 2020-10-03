const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const verifySchema = new mongoose.Schema(
  {
    token: { type: String, },
    email: { type: String },
    mobile:{ type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("verify", verifySchema);
