const mongoose = require("mongoose");
const LogSchema = new mongoose.Schema(
  {
    programId: { type: mongoose.Schema.Types.ObjectId, ref: "program" },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "PurchasedProgram" },
    week: { type: Number, default: null },
    day: { type: Number, default: null },
    exercise: { type: Number, default: null },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    message: { type: String, default: null },
    IsRead: { type: Boolean, default: false },
    type: { type: String, default: null },
    id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String, default: null },
    media:[{ type: String}],
    dayTitle: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

LogSchema.index({ orderId: 1, week: 1, day: 1 });
LogSchema.index({ clientId: 1, IsRead: 1 });
LogSchema.index({ instructorId: 1 });

module.exports = mongoose.model("progressLog", LogSchema);
