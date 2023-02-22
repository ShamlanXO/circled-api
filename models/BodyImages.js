const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    images: [{ type: String }],
    weight: { type: Number, default: 0 },
    description: { type: String },
    title: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("bodyImages", objectSchema);
