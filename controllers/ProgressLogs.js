const Order = require("../models/Orders");
const Log = require("../models/ProgressLogs");
var ObjectID = require("mongodb").ObjectID;

exports.CreateLog = (req, res) => {
  Order.find({
    _id: ObjectID(req.body.orderId),
    $or: [
      { UserId: req.userData._id },
      { "Program.createdBy": req.userData._id },
    ],
  }).then((orderResult) => {
    if (orderResult.length == 0) {
      return res.status(401).send({ message: "Unauthorized" });
    } else {
     
      const log = new Log({
        ...req.body,
        clientId: orderResult[0].UserId,
        programId: orderResult[0].Program._id,
        orderId: req.body.orderId,
        message: req.body.message,
        createdBy: req.userData._id,
        type: req.userData.type,
        title:
          orderResult[0].Program.ExercisePlan.weeks[req.body.week].days[
            req.body.day
          ].Exercise[req.body.exercise].title,
        dayTitle:
          orderResult[0].Program.ExercisePlan.weeks[req.body.week].days[
            req.body.day
          ].Title,

        instructorId: orderResult[0].Program.createdBy,
        id: orderResult[0].Program.ExercisePlan.weeks[req.body.week].days[
          req.body.day
        ].Exercise[req.body.exercise]._id,
      });
      log
        .save()
        .then((result) => {
          orderResult[0].Program.ExercisePlan.weeks[req.body.week].days[
            req.body.day
          ].Exercise[req.body.exercise].latestLog = {
            _id:result._id,
            createdBy: req.userData._id,
            message: req.body.message,
            createdAt: new Date(),
            name: req.userData.name,
            profilePic: req.userData.profilePic,
            type: req.userData.type,
          };
          orderResult[0].save();
          return res.status(201).send({
            message: "Log Created",
            ServerResponse: result,
            latestLog: {
              _id:result._id,
              createdBy: req.userData._id,
              message: req.body.message,
              createdAt: new Date(),
              name: req.userData.name,
              profilePic: req.userData.profilePic,
              type: req.userData.type,
            },
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).send({ ErrorOccured: error });
        });
    }
  });
};

exports.getPerticularLog = (req, res) => {
  Log.find({
    orderId: ObjectID(req.params.id),
    day: req.params.day,
    week: req.params.week,
    exercise: req.params.exercise,
    $or: [{ clientId: req.userData._id }, { instructorId: req.userData._id }],
  })

    .populate("createdBy", "name profilePic")

    .then((result) => {
      if (result.length == 0) {
        return res.status(404).send({ message: "Unauthorized" });
      } else {
        return res.status(200).send(result);
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.getLogHistory = (req, res) => {
  Log.aggregate([
    {
      $match: {
        orderId: ObjectID(req.params.id),
        $or: [
          { clientId: req.userData._id },
          { instructorId: req.userData._id },
        ],
      },
    },
    {
      $group: {
        _id: {
          week: "$week",
          day: "$day",
          exercise: "$exercise",
        },
        logs: {
          $push: {
            _id: "$_id",
            message: "$message",
            createdAt: "$createdAt",
            createdBy: "$createdBy",
            type: "$type",
            title: "$title",
            dayTitle: "$dayTitle",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        week: "$_id.week",
        day: "$_id.day",
        exercise: "$_id.exercise",

        logs: 1,
      },
    },
  ])

    .then((result) => {
      if (result.length == 0) {
        return res.status(404).send({ message: "no records found" });
      } else {
        return res.status(200).send(result);
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.deleteLog =(req, res) => {
  Log.findOneAndDelete({_id:req.params.id}).then(async(item)=>{
    if(!item)
    {
      res.status(500).send({ message:"Error"})
    }
 let OrderItem=await Order.findOne({
      _id: ObjectID(item.orderId),
      $or: [
        { UserId: req.userData._id },
        { "Program.createdBy": req.userData._id },
      ],
    })


if(OrderItem&& String(OrderItem.Program.ExercisePlan.weeks[item.week].days[
  item.day
  ].Exercise[item.exercise]?.latestLog?._id)==String(req.params.id))
    {
      OrderItem.Program.ExercisePlan.weeks[item.week].days[item.day].Exercise[item.exercise].latestLog={}
console.log("should delete item")
       await  OrderItem.save()
    
}


res.status(200).send({ message:"Log deleted",deleteRecent:false,deletedItem:item})
  }).catch((err)=>{
    console.log(err)
    res.status(500).send({ message:"Error"})
  })
}