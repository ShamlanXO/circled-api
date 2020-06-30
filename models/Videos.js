const mongoose = require("mongoose");

const VideoShareSchema = new mongoose.Schema({
  VideoId: { type: String, default: null },
  Title: {
    type: String,
    default: null,
  },
  Description: {
    type: String,
    default: null,
  },
Category:{ type: String, default: null},

 
  Share: { type: Boolean, default: false },
 

});

module.exports = mongoose.model("video_share", VideoShareSchema);
