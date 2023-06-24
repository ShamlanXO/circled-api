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
  triggerMuscle:[{type:String}]
});

const ExercisePlanSchema = new mongoose.Schema({
  Title: { type: String, default: null },
  IsRest: { type: Boolean, default: false },
  Exercise: [ExerciseSchema],
  Note: { type: String, default: null },
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
    Type: { type: String },
    Duration: {type: Number},
    GreetingMessage: { type: String },
    DietPlan: DietPlanSchema,
    ExercisePlan: Week,
    BannerImage: { type: String, default: null },
    BannerVideo: { type: String, default: null },
    IsPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const SentProgramSchema = new mongoose.Schema(
  {
    SenderId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    SendTo: [{ type: String }],
    Amount: { type: Number, default: 0 },
    Program: ProgramSchema,
    PaymentType: { type: String },
    Title: { type: String, default: null },
    ProductId: { type: String, default: null },
    SubscriptionId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sentprogram", SentProgramSchema);
