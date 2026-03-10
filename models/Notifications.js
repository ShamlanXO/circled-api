const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    To: [{ type: String }],
    Title: { type: String, default: null },
    Sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    Type: { type: String, default: "Personel" },
    Description: { type: String, default: null },
    Link: { type: String, default: null },
    SentProgramId: { type: mongoose.Schema.Types.ObjectId, ref: "sentprogram" },
    OrderId: { type: mongoose.Schema.Types.ObjectId, ref: "PurchasedProgram" },
    IsRead: { type: Boolean, default: false },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "client" },
    meta: {
      week: { type: Number, default: null },
      day: { type: Number, default: null },
      exercise: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

notificationSchema.index({ UserId: 1, IsRead: 1 });
notificationSchema.index({ To: 1 });

module.exports = mongoose.model("notification", notificationSchema);
