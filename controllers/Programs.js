const Program = require("../models/Programs");
const aqp = require("api-query-params");
const SentProgram = require("../models/SentPrograms");
const Notification = require("../models/Notifications");
var ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
exports.ProgramsAll = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Program.find(filter, { ExercisePlan: 0 })
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
  console.log("fetching all instructors program");
  console.log(req.userData._id);
  Program.find({ createdBy: req.userData._id }, { ExercisePlan: 0 })
    .populate("createdBy", "_id name profilePic")
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Program Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Program Listing", items: result });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.FetchSpecificProgram = (req, res) => {
  Program.findOne({ createdBy: req.userData._id, _id: req.params.Id })
    .populate("createdBy", "name profilePic")
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: "No Program Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Program Listing", item: result });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.FetchSpecificProgramPublic = (req, res) => {
  console.log("fetching specific");
  Program.findOne({ _id: req.params.Id })
    .populate("createdBy", "name profilePic")
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Program Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Program Listing", item: result });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateProgram = async (req, res) => {
  let isSuccess = true;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // always pass session to find queries when the data is needed for the transaction session

   const program= await Program.create([{ ...req.body, createdBy: req.userData._id }], {
      session: session,
    });

  

   const sentProgram= await SentProgram.create(
      [{ Program: program[0] ,
         Amount:req.body.Price, 
         SendTo:req.body.SendTo, 
         SenderId:req.userData._id,
         Title:program[0].Title
      }],
      { session: session }
    );




    await Notification.create([{

   
      To:req.body.SendTo,
     
      Type:"SentProgram",
      Sender:sentProgram[0].SenderId,
      SentProgramId:sentProgram[0]._id
 


    }], {
      session: session,
    });

    
    // save the sender updated balance
    // do not pass the session here
    // mongoose uses the associated session here from the find query return
    // more about the associated session ($session) later on

    // commit the changes if everything was successful
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    // if anything fails above just rollback the changes here
    isSuccess = false;

    // this will rollback any changes made in the database
    await session.abortTransaction();
    return res.status(500).send({ ErrorOccured: error });
    // logging the error

    // rethrow the error
  } finally {
    // ending the session
    session.endSession();

    if (isSuccess) {
      return res.status(201).send();
    } else {
      return res.status(500).send();
    }
  }

  // console.log(req.body)
  // const ProgramCon = new Program({...req.body,createdBy:req.userData._id});
  // ProgramCon
  //   .save()
  //   .then(result => {
  //     return res
  //       .status(201)
  //       .send({ Message: "Program Created", item: result });
  //   })
  //   .catch(error => {
  //     return res.status(500).send({ ErrorOccured: error });
  //   });
};

exports.UpdateProgram = (req, res) => {
  console.log(req.body);
  delete req.body.createdBy;
  Program.updateOne(
    { createdBy: req.userData._id, _id: req.body._id },
    { ...req.body }
  )
    .then((result) => {
      console.log(result);
      return res.status(200).send({ message: "Program Updated" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteProgram = (req, res) => {
  Program.deleteOne({ _id: req.params.Id, createdBy: req.userData._id })
    .then((result) => {
      return res.status(200).send({ message: "Program  Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
