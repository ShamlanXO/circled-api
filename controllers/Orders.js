const Order = require("../models/Orders");
const aqp = require("api-query-params");
const TestSeries = require("../models/TestSeries");
var ObjectID = require("mongodb").ObjectID;

exports.SearchOrder = (req, res) => {
  console.log(req.userData._id)
Order.find({UserId:req.userData._id}).populate("Program.createdBy","name profilePic _id").then((result) => {

  if (result.length < 1) {
    return res.status(404).send({
      message: "No order Found",
    });
  } else {
    return res.status(200).send({
      message: "List of orders",
      Programs: result,
    });
  }
}).catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.CreateOrder=(req, res)=>{
  console.log("Sdsd")
  const order = new Order(req.body);
  order
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ message: "Order Created", ServerResponse: result });
    })
    .catch(error => {
      console.log(error)
      return res.status(500).send({ ErrorOccured: error });
    });
}



exports.GetClients=(req, res)=>{
  Order.find({"Program.createdBy":req.userData._id,isActive:true},{"Program.ExercisePlan":0}).populate("UserId","name profilePic _id").then((result) => {
    if (result.length < 1) {
      return res.status(404).send({
        message: "No order Found",
      });
    } else {
      return res.status(200).send({
        message: "List of users",
        clients: result,
      });
    }
  }).catch((error) => {
        return res.status(500).send({
          ErrorOccured: error,
        });
      });
  
}

exports.GetSpecificClients=(req, res)=>{
  Order.findOne({UserId:req.params.Id,"Program.createdBy":req.userData._id}).populate("UserId","-password").then((result) => {
    if (!result) {
      return res.status(404).send({
        message: "No order Found",
      });
    } else {
      return res.status(200).send({
        message: "List of users",
        clientData: result,
      });
    }
  }).catch((error) => {
        return res.status(500).send({
          ErrorOccured: error,
        });
      });
  
}



exports.GetOrder = (req, res) => {

  Order.findOne({UserId:req.userData._id,"Program._id":req.params.id}).populate("Program.createdBy","name profilePic _id").then((result) => {
    if (!result) {
      return res.status(404).send({
        message: "No order Found",
      });
    } else {
      return res.status(200).send({
        message: "Order found",
        Program: result,
      });
    }
  }).catch((error) => {
        return res.status(500).send({
          ErrorOccured: error,
        });
      });
  };
  

exports.CheckExist = (req, res) => {
 
  const { UserId ,CourseId} = req.query
  Order
    .find({UserId:UserId,"Items.Course":CourseId})
   
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No order Found"
        });
      } else {
        return res.status(200).send({
          message: "List of orders",
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


// exports.CreateOrder = (req, res) => {
//   const order = new Order(req.body);
//   order
//     .save()
//     .then((result) => {
//       return res.status(201).send({
//         message: "Order Instance created Successfully",
//         id: result._id,
//       });
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.CreateOrderBulk = (req, res) => {
//   const orderData = req.body.data;
//   console.log(orderData);
//   Order.insertMany(orderData)
//     .then((result) => {
//       console.log(result);
//       return res.status(201).send({
//         message: "Order Instance created Successfully",
//         id: result._id,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

exports.UpdateOrder = (req, res) => {
 console.log(req.body.Program)
  Order.updateOne({ _id: req.body._id ,"Program.createdBy":req.userData._id}, {Program:req.body.Program}, function (err, response) {
    if (err) {
  
      return res.status(500).send({ ErrorOccured: error });
    }
    if (response) {
      console.log(response)
      return res.status(200).send({ message: "Order Details Updated" });
    }
  }).catch((error) => {
    return res.status(500).send({ ErrorOccured: error });
  });
};


exports.SwitchProgram = (req, res) => {
  let {_id,isActive}=req.body


  Order.updateOne({ "Program._id": _id,UserId:req.userData._id}, {isActive}, function (err, response) {
    if (err) {
  
      return res.status(500).send({ ErrorOccured: error });
    }
    if (response) {
      console.log(response)
      return res.status(200).send({ message: "Order Details Updated" });
    }
  }).catch((error) => {
    return res.status(500).send({ ErrorOccured: error });
  });
};


// exports.DeleteOrder = (req, res) => {
//   Order.findByIdAndRemove(req.params.Id)
//     .then((result) => {
//       return res.status(200).send({ message: "Order Deleted Successfully" });
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };

// exports.CheckOrderExistence = (req, res) => {
//   const { filter, skip, limit, sort, projection } = aqp(req.query);
//   Order.aggregate([
//     { $match: { UserId: ObjectID(filter.UserId) } },
//     { $unwind: "$Items" },
//     {
//       $lookup: {
//         from: "test_series",
//         localField: "Items.TestSeries",
//         foreignField: "_id",
//         as: "TestSeries",
//       },
//     },
//     {
//       $match: {
//         "TestSeries.Tests": ObjectID(filter.TestId),
//       },
//     },
//   ])
//     .then((result) => {
//       if (result.length < 1) {
//         return res.status(404).send({ message: "No Order Found" });
//       } else {
//         return res.status(200).send({ message: "Order Found" });
//       }
//     })
//     .catch((error) => {
//       return res.status(500).send({ ErrorOccured: error });
//     });
// };
