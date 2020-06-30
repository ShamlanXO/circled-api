const mongoose = require("mongoose");

const CurrentAffairsSchema = new mongoose.Schema({
  Headline: { type: String, default: null },
  Highline: {
    type: String,
    default: null,
  },
  Section: {
    type: String,
    default: null,
  },

 
  Share: { type: Boolean, default: false },
  Date: { type: Date },

});

module.exports = mongoose.model("current_affairs", CurrentAffairsSchema);
