

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    TransactionId: { type: String, default: null },
    Amount: { type: Number },
    Mobile: { type: Number },
    Email: { type: String },
    PayeeName: { type: String },
    Status: {
      type: String,
      enum: ["Inactive", "Pending", "Active"],
      default: "Inactive"
    },
    Mode: { type: String },
    Signature: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
