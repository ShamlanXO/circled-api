const Feed = require("../models/Feed");
const aqp = require("api-query-params");
const moment = require("moment");
const User = require("../models/user");
var ObjectID = require("mongodb").ObjectID;



exports.getFeed = (req, res) => {
console.log(req.params)

  Feed.aggregate([

  


   { $lookup: {
      from: "test_series",
      localField: "TestSeries",    // field in the orders collection
      foreignField: "_id",  // field in the items collection
      as: "TestSeries"
   }}
   , 
   { $lookup: {
    from: "study_material",
    localField: "StudyMaterial",    // field in the orders collection
    foreignField: "_id",  // field in the items collection
    as: "StudyMaterial"
 }}
   , 
   { $lookup: {
    from: "test_set",
    localField: "TestSet",    // field in the orders collection
    foreignField: "_id",  // field in the items collection
    as: "TestSet"
 }},
 { $lookup: {
  from: "daily_mains",
  localField: "DailyMains",    // field in the orders collection
  foreignField: "_id",  // field in the items collection
  as: "DailyMains"
}}
   ,
   { $lookup: {
    from: "announcements",
    localField: "Announcement",    // field in the orders collection
    foreignField: "_id",  // field in the items collection
    as: "Announcement"
  }}
  ,

   {
    $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT",{ $arrayElemAt: [ "$TestSeries", 0 ] },{_id:"$$ROOT._id"} ] } }
 }
 , 
 {
  $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT",{ $arrayElemAt: [ "$StudyMaterial", 0 ] },{_id:"$$ROOT._id"} ] } }
}
, 
{
  $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", { $arrayElemAt: [ "$TestSet", 0 ] }, ,{_id:"$$ROOT._id"}  ] } }
}
, 
{
  $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT" , {  $arrayElemAt: [ "$DailyMains", 0 ] },{_id:"$$ROOT._id"} ] } }
},
{
  $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$Announcement", 0 ] }, "$$ROOT" ] } }
},
{$match:{ $and:[{StartDate: { $lt:new Date(req.params.date) }}]}},
{$skip:Number(req.params.skip)},
{$limit:Number(req.params.limit)},
{$sort: { StartDate: -1 }}

])
  
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No Data found for feeds",
        });
      } else {
        return res.status(200).send({
          message: "",
          ServerResponse: result,
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.CreateFeed = (req, res) => {
  const feed = new Feed();
  feed
    .save()
    .then((result) => {
      return res
        .status(201)
        .send({ message: "feed Created", id: result._id });
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.CreateImplicitFeed=(data)=>{
return new Promise((resolve, reject)=>{
  const feed=new Feed(data);
  feed.save()
  .then((result)=>{
    return resolve(result)
   
  }).catch((error)=>{
    return reject(error)
  })
})
}



exports.DeleteFeed = (req, res) => {
  Feed.findByIdAndRemove(req.params.Id)
    .then((result) => {
      return res.status(200).send({ message: "Feed Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};



exports.IncreaseTotalLikes = (req, res) => {
  Feed.updateOne(
    {
      _id: req.query.FeedId,
    },
    { $addToSet: { LikedBy: req.body.LikedBy } }
  )
    .then((result) => {
      res.status(200).send({ Message: "Liked", result });
    })
    .catch((error) => {
      res.status(500).send({ ErrorOccured: error });
    });
};

exports.DecreaseTotalLikes = (req, res) => {
  DailyMains.updateOne(
    {
        _id: req.query.FeedId,
    },
    { $pull: { LikedBy: req.body.LikedBy } }
  )
    .then((result) => {
      res.status(200).send({ Message: "Disliked", result });
    })
    .catch((error) => {
      res.status(500).send({ ErrorOccured: error });
    });
};

exports.SubmittedComment = (req, res) => {
  DailyMains.update(
    { _id: req.params.Id },
    { $addToSet: { Comments: req.body } },
    function (err, doc) {
      if (err) {
        return res
          .status(500)
          .send({ mesage: "Error Submitting the comment", ErrorOccured: err });
      } else {
        return res.status(200).send({ message: "comment Submitted" });
      }
    }
  ).catch((error) => {
    return res
      .status(500)
      .send({ mesage: "Error Submitting the comment", ErrorOccured: err });
  });
};




