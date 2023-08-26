const Library = require("../models/MediaUploads");
const Program= require("../models/Programs");
const WorkoutLibrary=require("../models/WorkoutLibrary");
const aqp = require("api-query-params");
var ObjectID = require("mongodb").ObjectID;
exports.FetchVideoLibrary = (req, res) => {

    Program.aggregate(

    [
      {
        $unwind:"$ExercisePlan"
      },
      {
        $unwind:"$ExercisePlan.weeks"
      },
      {
        $unwind:"$ExercisePlan.weeks.days"
      },
      {
        $unwind:"$ExercisePlan.weeks.days.Exercise"
      },
      {
        $unwind:"$ExercisePlan.weeks.days.Exercise.media"
      },
    
      {$group: {
        _id: '$ExercisePlan.weeks.days.Exercise.media',
       uniqueNames: { $first: "$ExercisePlan.weeks.days.Exercise.title" }
      }},
// {
//     $project:{
//         video:"$ExercisePlan.weeks.days.Exercise.media",
//         name:"$ExercisePlan.weeks.days.Exercise.title",
//     }
// }

    ]
    
    
    
    ).then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Libraryes Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Libraryes Listing", items: result  });
      }
    })
    .catch(error => {
        console.error(error,"error: " + error)
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.getAllVideos=(req,res)=>{
  Library.find({UserId:req.userData._id,UploadedSuccess:true, savedToLibrary:true}).sort({createdAt:-1}).then(result=>{
    res.status(200).send(result)
  }).catch(err=>{
    res.status(500).send(err)
  })
}

exports.updateVideo=(req,res)=>{
  delete req.body.UserId
  
  Library.updateOne({UserId:req.userData._id,_id:req.body._id},{...req.body}).then(result=>{
    res.status(200).send(result)
  }).catch(err=>{
    res.status(500).send(err)
  })
}

exports.saveVideoToLibrary=(req,res)=>{  
  Library.findOneAndUpdate({key:req.body.key},{savedToLibrary:true}).then(result=>{
    res.status(200).send(result)
  }).catch(err=>{
    res.status(500).send(err)
  })
}

exports.addVideo=(req,res)=>{
  delete req.body.UserId
 Library.findOneAndUpdate({
    UserId:req.userData._id,
    
    key:req.body.key
  },{
    ...req.body
  }).then(result=>{
    if(result){
     
      res.status(200).send({...result,...req.body});
    }
    else{
      res.status(500).send("no record found")
    }

  }).catch(err=>{
    console.log(err)
    res.status(500).send(err)
  })
}

exports.getWorkouts=(req,res)=>{
  WorkoutLibrary.find({CreatedBy:req.userData._id}).then(result=>{
res.status(200).send(result)
  }).catch(err=>{
    res.status(500).send(err)
  })
}

exports.getWorkout=(req, res) => {
 
  WorkoutLibrary.findOne({_id:req.params.id}).populate("CreatedBy","name profilePic").then(result=>{
   if(result)
   res.status(200).send(result)
  else
  res.status(404).send("no record found")
  }).catch(err=>{
    console.log(err)
    res.status(500).send(err)
  })
}

exports.addWorkout=(req,res)=>{
 WorkoutLibrary.findOneAndUpdate(
  {_id:req.body._id},
  {...req.body,CreatedBy:req.userData._id},
  {
    new: true,
    upsert: true // Make this update into an upsert
  }
  
  ).then(result=>{
  res.status(200).send(result)
}).catch(err=>{
  console.log(err)
    res.status(500).send(err)
  })
}

exports.updateWorkout=(req,res)=>{
  WorkoutLibrary.updateOne({_id:req.body._id},{...req.body,CreatedBy:req.userData._id}).then(result=>{
    res.status(200).send(result)
      }).catch(err=>{
        res.status(500).send(err)
      })
}


exports.deleteWorkout=(req,res)=>{
  WorkoutLibrary.deleteOne({_id:req.params.id,CreatedBy:req.userData._id}).then(result=>{
    res.status(200).send(result)
      }).catch(err=>{
        res.status(500).send(err)
      })
}