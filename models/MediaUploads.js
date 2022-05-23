const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
size:{type:Number},
  url:{type:String},
  id:{type:String}

},
{ timestamps: true});

module.exports = mongoose.model("medi", mediaSchema);
