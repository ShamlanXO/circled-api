const mongoose = require("mongoose");
const DietPlanSchema = new mongoose.Schema({
  Title: { type: String, default: null },
  File: { type: String, default: null },
  Description: { type: String, default: null },
});

const ExerciseSchema = new mongoose.Schema({
  media: [{type:String}],
  title: { type: String, default: null },
  reps: { type: Number, default: null },
  sets: { type: Number, default: null },
  note: { type: String, default: null },
  rest: { type: Number, default: null },
  banner: { type: String, default: null },
  triggerMuscle:[{type:String}],
  isAttempted: { type: Boolean, default: false },
});

const ExercisePlanSchema = new mongoose.Schema({
  Title: { type: String, default: null },
  IsRest: { type: Boolean, default: false },
  Exercise: [ExerciseSchema],
  Cover: { type: String, default: null },
});
const  Day=new mongoose.Schema(
  {
    days:[ExercisePlanSchema]
  }
)
const Week=new mongoose.Schema(
  {
    weeks:[Day]
  }
)

const ProgramSchema = new mongoose.Schema(
  {
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    Title: { type: String, default: null },
    Category: [{ type: String }],
    Description: { type: String, default: null },
    Benifits: { type: String, default: null },
    ExtraInfo: { type: String, default: null },
    Requirements: { type: String, default: null },
    Type: { type: String, default: null },
    PaymentType: { type: String },
    Price: { type: Number },
    Discount: { type: Number },
    GreetingMessage: { type: String },
    Type: { type: String },
    Duration: {type: Number},
    DietPlan: DietPlanSchema,
    ExercisePlan: Week,
    BannerImage: { type: String, default: null },
    BannerVideo: { type: String, default: null },
    IsPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    PaymentId: { type: mongoose.Schema.Types.ObjectId, ref: "payment" },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    Status: {
      type: String,
      enum: ["Inactive", "Pending", "Active"],
      default: "Inactive",
    },
    isActive: { type: Boolean, default: false },
    Program: ProgramSchema,
    SubscriptionId: { type: String },
    SentProgramId: { type: mongoose.Schema.Types.ObjectId, ref: "sentprogram" },
    stats: {},
    currentWeek: { type: Number, default: 0 },
    currentDay: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchasedProgram", orderSchema);
