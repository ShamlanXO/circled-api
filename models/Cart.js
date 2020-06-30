const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  TestSet: { type: mongoose.Schema.Types.ObjectId, ref: "test_set" },
  TestSeries: { type: mongoose.Schema.Types.ObjectId, ref: "test_series" },
  Type: { type: String, enum: ["TestSeries", "TestSet"] }
});
const cartSchema = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    Items: [itemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
