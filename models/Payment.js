

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
   
    Amount: { type: Number },
   User:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },
    SubscriptionId: { type: String },
    OrderId:{ type: String},
    ProgramId:{ type: mongoose.Schema.Types.ObjectId, ref: "program" },
    SendProgramId:{ type: mongoose.Schema.Types.ObjectId, ref: "sentprogram" },
    Status: {
      type: String,
      enum: ["Inactive", "Pending", "Active","Unsubscribed","Terminated"],
      default: "Inactive"
    },
    Type:{  
      type: String,
      enum: ["Subscription", "OneTime"],
      default: "OneTime"},
    Mode: { type: String },
    paymentDetails:{}
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
