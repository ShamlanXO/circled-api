const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
  media: [{ type: String }],
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
  Program:{ type:String, default: null  },
  Exercise: [ExerciseSchema],
  Cover: { type: String, default: null },
  Note: { type: String, default: null },
  CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
},
{ timestamps: true });



module.exports = mongoose.model("workoutLibrary", ExercisePlanSchema);
