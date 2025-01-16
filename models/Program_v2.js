const mongoose = require("mongoose");
const DietPlanSchema = new mongoose.Schema({
  Title: { type: String, default: null },
  File: { type: String, default: null },
  Description: { type: String, default: null },
});
const MediaSchema = new mongoose.Schema({
  type: { type: String, default: null },
  file: { type: String, default: null },
  title: { type: String, default: null },
  description: { type: String, default: null },
});
const ExerciseSchema = new mongoose.Schema({
  media: [ MediaSchema ],
  title: { type: String, default: null },
  reps: { type: Number, default: null },
  sets: { type: Number, default: null },
  note: { type: String, default: null },
  rest: { type: Number, default: null },
  banner: { type: String, default: null },

  triggerMuscle: [{ type: String }],
});

const ExercisePlanSchema = new mongoose.Schema({
  Title: { type: String, default: null },
  IsRest: { type: Boolean, default: false },
  Exercise: [ExerciseSchema],
  Cover: { type: String, default: null },
  Note: { type: String, default: null },
});

const Day = new mongoose.Schema({
  days: [ExercisePlanSchema],
});
const Week = new mongoose.Schema({
  weeks: [Day],
});
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
    ProgramType:{type:String},
    Price: { type: Number, default: 0 },
    Discount: { type: Number },
    Type: { type: String },
    Duration: { type: Number },
    IsDraft: { type: Boolean, default: false },
    IsDeleted: { type: Boolean, default: false },
    IsArchived: { type: Boolean, default: false },
    DietPlan: DietPlanSchema,
    ExercisePlan: Week,
    calendarType:{ type: String, default: null },
    maximumClient:{ type: String, default: null},
    totalClients:{ type: Number},
    BannerImage: { type: String, default: null },
    BannerVideo: { type: String, default: null },
    IsPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    PlanId: { type: String, default: null },
    ProductId: { type: String, default: null },
    Notes: { type: String, default: null },
    ScreenStats:{
      CurrentScreen:{ type: String, default: null },
      Week:{type:Number,default:null},
      Day:{type:Number,default:null},
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("program", ProgramSchema, "v2");
