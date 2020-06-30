const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  TestSet: { type: mongoose.Schema.Types.ObjectId, ref: "test_set" },
  TestSeries: { type: mongoose.Schema.Types.ObjectId, ref: "test_series" },
  Type: { type: String, enum: ["TestSeries", "TestSet"] },
  PurchasePrice: { type: Number, default: 0 }
});
const orderSchema = new mongoose.Schema(
  {
    PaymentId: { type: String, default: null },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    ActualAmount: { type: Number, default: 0 },
    AmountPaid: { type: Number, default: 0 },
    ReceiptNumber: { type: String, default: null },
    Receipt: { type: String, default: null },
    PurchaseType: { type: String, enum: ["Course", "TestSeries", "TestSet"] },
    PaymentType: {type: String, enum: ["Online", "Offline"],Default:"Online" },
    TestSetId: { type: mongoose.Schema.Types.ObjectId, ref: "test_set" },
    TestSeriesId: { type: mongoose.Schema.Types.ObjectId, ref: "test_series" },
    Items: [itemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
