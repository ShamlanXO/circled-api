const Program = require("../models/Programs");
const aqp = require("api-query-params");
var ObjectID = require("mongodb").ObjectID;

exports.ProgramsAll = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Program
    .find(filter,{ExercisePlan:0})
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No User Found",
        });
      } else {
        return res.status(200).send({
          message: "List of Users",
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


exports.ProgramsInstructor = (req, res) => {
  console.log("fetching all instructors program")
  console.log(req.userData._id)
    Program.find({createdBy:req.userData._id},{ExercisePlan:0}).populate("createdBy","_id name profilePic").then(result => {
        if (result.length < 1) {
          return res.status(404).send({ message: "No Program Found" });
        } else {
          return res
            .status(200)
            .send({ message: "Program Listing", items: result });
        }
      })
      .catch(error => {
        return res.status(500).send({ ErrorOccured: error });
      });
  };


  exports.FetchSpecificProgram = (req, res) => {
    console.log("fetching all instructors program")
      Program.findOne({createdBy:req.userData._id,_id:req.params.Id}).populate("createdBy","name profilePic").then(result => {
          if (result.length < 1) {
            return res.status(404).send({ message: "No Program Found" });
          } else {
            return res
              .status(200)
              .send({ message: "Program Listing", item: result });
          }
        })
        .catch(error => {
          return res.status(500).send({ ErrorOccured: error });
        });
    }

    exports.FetchSpecificProgramPublic = (req, res) => {
      console.log("fetching specific")
        Program.findOne({_id:req.params.Id}).populate("createdBy","name profilePic").then(result => {
            if (result.length < 1) {
              return res.status(404).send({ message: "No Program Found" });
            } else {
              return res
                .status(200)
                .send({ message: "Program Listing", item: result });
            }
          })
          .catch(error => {
            return res.status(500).send({ ErrorOccured: error });
          });
      }


exports.CreateProgram = (req, res) => {
  console.log(req.body)
  const ProgramCon = new Program({...req.body,createdBy:req.userData._id});
  ProgramCon
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ Message: "Program Created", item: result });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateProgram = (req, res) => {
  console.log(req.body)
    delete req.body.createdBy
  Program.updateOne({  createdBy:req.userData._id,_id:req.body._id}, {...req.body})
    .then(result => {
      console.log(result)
      return res.status(200).send({ message: "Program Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteProgram = (req, res) => {
  Program.deleteOne({_id: req.params.Id,createdBy:req.userData._id })
    .then(result => {
      return res.status(200).send({ message: "Program  Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
