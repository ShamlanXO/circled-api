const mongoose = require("mongoose");
const fileStructure = new mongoose.Schema({
  type: {   type: String,    enum: ["exercise", "other"]},
  url: { type: String, default: null },
  title: { type: String, default: null },
  banner:{ type: String, default:null},
  otherDetails:{

  }
});

const objectSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    type: {
      type: String,
      enum: ["folder", "file"],
      default: "folder",
    },
     recent: {type:Boolean, default:false},
    title: { type: String },
    ancestors: [{ type: mongoose.Schema.Types.ObjectId }],
    parent: { type: mongoose.Schema.Types.ObjectId, default: null },
    file:fileStructure
  },
  { timestamps: true }
);

objectSchema.index({ createdBy: 1, type: 1 });
objectSchema.index({ parent: 1 });
objectSchema.index({ ancestors: 1 });

module.exports = mongoose.model("library", objectSchema);
