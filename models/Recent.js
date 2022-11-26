const mongoose = require("mongoose");
const RecentSchema = new mongoose.Schema(
  {
    programId: { type: mongoose.Schema.Types.ObjectId, ref: "program" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "PurchasedProgram" },
    type: { type: String, default: null },
    email: { type: String, default: null },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    ExtraInfo: { type: {}, default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model("recent", RecentSchema);
