const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
  Comment: { type: String, default: null },
  Attachment: [{ type: String, default: null }],
  LikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  GivenBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});
const CommentSchema = new mongoose.Schema({
  SubmittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  Message: { type: String, default: null },
  Attachment: [{ type: String, default: null }],
  LikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  Reply: [feedbackSchema],
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

const StudyMaterialSchema = new mongoose.Schema(
  {
Files:[{type: String}],
Title:{ type: String,default: null},
Details:{ type: String,default: null},
Section:{ type: String,default: null},
Share: { type: String, default: "Public" },
LikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
 Comments: [CommentSchema],
 Banner:{ type: String, default: null}
  },
  { timestamps: true }
);

module.exports = mongoose.model("study_material", StudyMaterialSchema);
