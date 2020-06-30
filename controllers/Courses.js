const Courses = require("../models/Courses");
const aqp = require("api-query-params");
var ObjectID = require("mongodb").ObjectID;
const {CreateImplicitFeed}=require("./Feed.js")
exports.Search = (req, res) => {
  console.log("getting")
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Courses
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate("CreatedBy")
   
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No Courses found"
        });
      } else {
        return res.status(200).send({
          message: " Search Result",
          ServerResponse: result
        });
      }
    })
    .catch(error => {
      return res.status(500).send({
        ErrorOccured: error
      });
    });
};

exports.Create = (req, res) => {
  const CoursesModel = new Courses(req.body);

  CoursesModel
    .save()
    .then(result => {
      CreateImplicitFeed({Courses:result._id,Type:"Courses"})
      return res.status(201).send({
        message: "Course  Created Successfully",
        _id:result._id
      });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};


exports.AddRating = (req, res) => {

console.log(req.body)
  Courses.updateOne({ _id:ObjectID(req.body._id)},
    { $addToSet: { Rating: req.body.Rating } },
    function(err, doc) {
      if (err) {
        return res.status(500).send({
          message: "Error Updating ",
          ErrorOccured: err
        });
      } else {
        console.log(doc)
        return res.status(200).send({
          message: " Updated Successfully",
          result: doc
        });
      }
    }

  )
    
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
}

exports.UpdateRating = (req, res) => {
console.log(req.body)

  Courses.updateOne({ _id:ObjectID(req.body._id),"Rating.user":ObjectID(req.body.Rating.user)},
    { $set: { "Rating.$": req.body.Rating } },
   
    function(err, doc) {
      if (err) {
        return res.status(500).send({
          message: "Error Updating ",
          ErrorOccured: err
        });
      } else {
        return res.status(200).send({
          message: " Updated Successfully",
        
        });
      }
    }

  )
    
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
}




exports.Update = (req, res) => {
  console.log(req.body)
  Courses
    .update({ _id: req.body._id }, req.body, function(err, doc) {
      if (err) {
        return res.status(500).send({
          message: "Error Updating ",
          ErrorOccured: err
        });
      } else {
        return res.status(200).send({
          message: " Updated Successfully",
          result: doc
        });
      }
    })
    .catch(error => {
      return res.status(500).send({
        ErrorOccured: error
      });
    });
};

exports.GetCourses = (req, res) => {
    const { skip, limit,orderBy,orderType,Category} = req.query
    console.log(req.query)
    Courses.aggregate([

        {$facet:{
            totalRecords:[
              {$match:Category?{Category:Category}:{}},
                {
                    $count: "totalRecords"
                  }
            ],
            records:[
            

           {$match:Category?{Category:Category}:{}},
                 
                 {$sort:{[orderBy]:Number(orderType)}},
                {$skip:Number(skip)},
                {$limit:Number(limit)},
                {
                  $lookup: {
                    from: "users",
                    localField: "CreatedBy",
                    
                    foreignField: "_id",
                    as: "Creator"
                  }
                },

                {   
               
                  $set: {
                        AverageRating: { $avg: "$Rating.Score" },
                  
                     }},
                
                {
                  $project:{
                AverageRating:1,
                CoverImage:1,
                Title:1,
                Category:1,
                Level:1,
                Lectures:1,
                Description:1,
                Duration:1,
                Video:1,
                ActualPrice:1,
                SellingPrice:1,
                createdAt:1,
                CreatorName:{$arrayElemAt:['$Creator',0]}


                  }
                }
                
            ]
        }}
     

    ])
      
     
      .then(result => {
        if (result.length < 1) {
          return res.status(404).send({
            message: "No Courses found"
          });
        } else {
          return res.status(200).send({
            message: " Search Result",
            ServerResponse: result
          });
        }
      })
      .catch(error => {
        return res.status(500).send({
          ErrorOccured: error
        });
      });
  };

exports.Delete = (req, res) => {
  Courses.findByIdAndRemove(req.params.Id).then(result => {
    return res
      .status(200)
      .send({
        message: "Course Deleted"
      })
      .catch(errror => {
        return res.status(500).send({
          ErrorOccured: error
        });
      });
  });
};


