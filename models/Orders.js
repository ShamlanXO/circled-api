const mongoose = require("mongoose");
const Client = require('./Clients'); 

const DietPlanSchema = new mongoose.Schema({
  Title: { type: String, default: null },
  File: { type: String, default: null },
  Description: { type: String, default: null },
});

const ExerciseSchema = new mongoose.Schema({
  media: [],
  title: { type: String, default: null },
  reps: { type: Number, default: null },
  sets: { type: Number, default: null },
  note: { type: String, default: null },
  rest: { type: Number, default: null },
  banner: { type: String, default: null },
  latestLog: {
    _id: { type:mongoose.Schema.Types.ObjectId},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    message: { type: String, default: null },
    createdAt: { type: Date, default: null },
    name: { type: String, default: null },
    profilePic: { type: String, default: null },
    type: { type: String, default: null },
    media:[{ type: String}]
  },
  triggerMuscle: [{ type: String }],
  isAttempted: { type: Boolean, default: false },
});

const ExercisePlanSchema = new mongoose.Schema({
  Title: { type: String, default: null },
  IsRest: { type: Boolean, default: false },
  Exercise: [ExerciseSchema],
  Cover: { type: String, default: null },
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
    calendarType:{ type: String, default: null },
    maximumClient:{ type: String, default: null},
    totalClients:{ type: Number},
    Price: { type: Number },
    Discount: { type: Number },
    GreetingMessage: { type: String },
    Type: { type: String },
    Duration: { type: Number },
    DietPlan: DietPlanSchema,
    ExercisePlan: Week,
    BannerImage: { type: String, default: null },
    BannerVideo: { type: String, default: null },
    IsPublished: { type: Boolean, default: true },
    Notes: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const todoSchema = new mongoose.Schema({
  value: { type: String, required: true },
  isDone: { type: Boolean, default: false },
});

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
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "client"},
    todo: [todoSchema],
    currentWeek: { type: Number, default: 0 },
    currentDay: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// orderSchema.pre('save',  function(next) {
//   console.log('pre save hook');
//   // if (this.isModified('UserId') || this.isNew) {
//   //   try {
//   //     this.clientId = await deriveClientIdFromUserId(this.UserId, this.Program.CreatedBy);
//   //     next();
//   //   } catch (error) {
//   //     next(error);
//   //   }
 
//     next();
  
// });

orderSchema.plugin((schema)=>{
  console.log('plugin hook');
  schema.pre('save',  function() {
    console.log('pre save hook');
    // if (this.isModified('UserId') || this.isNew) {
    //   try {
    //     this.clientId = await deriveClientIdFromUserId(this.UserId, this.Program.CreatedBy);
    //     next();
    //   } catch (error) {
    //     next(error);
    //   }
   
      
    
  });
  schema.post('save',  function() {
    console.log('pre save hook');
    // if (this.isModified('UserId') || this.isNew) {
    //   try {
    //     this.clientId = await deriveClientIdFromUserId(this.UserId, this.Program.CreatedBy);
    //     next();
    //   } catch (error) {
    //     next(error);
    //   }
   
      
    
  });
});

module.exports = mongoose.model("PurchasedProgram", orderSchema);
