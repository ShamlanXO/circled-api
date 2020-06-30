const mongoose = require("mongoose");

const CentreSchema = new mongoose.Schema({
  Email: { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ },
  Location: { type: String, default: null },
  ContactNumbers: [{ type: Number, default: 0 }],
  ContactEmails: [
    { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ }
  ],
  FullAddress: { type: String, default: null }
});

module.exports = mongoose.model("centre", CentreSchema);
