const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const verifySchema = new mongoose.Schema(
  {
    token: { type: String, },
    email: { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ },
  },
  { timestamps: true }
);

module.exports = mongoose.model("verify", verifySchema);
