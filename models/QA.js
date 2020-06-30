const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
    User:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
    Answer:{type:String, default: null},
    createdAt:{type: Date, default: new Date()}
},  { timestamps: true })

const BatchSchema = new mongoose.Schema({
  User:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
  CourseId: { type: mongoose.Schema.Types.ObjectId, default: null },
  SectionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  ContentId: {
    type: mongoose.Schema.Types.ObjectId
    , default: null
  },
  Question: { type: String, 
    default:null,
    required:true
   
  },
  Answers: [AnswerSchema]
  
},  { timestamps: true });

module.exports = mongoose.model("qa", BatchSchema);
