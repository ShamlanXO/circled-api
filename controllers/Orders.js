const Order = require("../models/Orders");
const aqp = require("api-query-params");
const TestSeries = require("../models/TestSeries");
var ObjectID = require("mongodb").ObjectID;
exports.SearchOrder = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Order.aggregate([
    { $match: { UserId: ObjectID(filter.UserId) } },
    { $unwind: "$Items" },
    {
      $lookup: {
        from: "test_series",
        localField: "Items.TestSeries",
        foreignField: "_id",
        as: "TestSeries"
      }
    },
    {
      $lookup: {
        from: "test_sets",
        localField: "Items.TestSets",
        foreignField: "_id",
        as: "TestSets"
      }
    },
    {
      $lookup: {
        from: "courses",
        localField: "Items.Course",
        foreignField: "_id",
        as: "Course"
      }
    }

  ])
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Order Data Found" });
      } else {

let testseries=result.map(item =>
 { if(item.TestSeries.length>0)
  return item.TestSeries[0]}
  )

  TestSeries.find({_id:{$in:testseries}}).populate("CreatedBy").then(response =>{
    return res
    .status(200)
    .send({ message: "Order Data", ServerResponse: result,series:response });
  })

        
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.GetOrder = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Order.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate("UserId")
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No order Found",
        });
      } else {
        return res.status(200).send({
          message: "List of orders",
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


exports.CreateOrder = (req, res) => {
  const order = new Order(req.body);
  order
    .save()
    .then((result) => {
      return res.status(201).send({
        message: "Order Instance created Successfully",
        id: result._id,
      });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateOrderBulk = (req, res) => {
  const orderData = req.body.data;
  console.log(orderData);
  Order.insertMany(orderData)
    .then((result) => {
      console.log(result);
      return res.status(201).send({
        message: "Order Instance created Successfully",
        id: result._id,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateOrder = (req, res) => {
  Order.update({ _id: req.params.Id }, req.body, function (err, res) {
    if (err) {
      return res.status(500).send({ ErrorOccured: error });
    }
    if (res) {
      return res.status(200).send({ message: "Order Details Updated" });
    }
  }).catch((error) => {
    return res.status(500).send({ ErrorOccured: error });
  });
};

exports.DeleteOrder = (req, res) => {
  Order.findByIdAndRemove(req.params.Id)
    .then((result) => {
      return res.status(200).send({ message: "Order Deleted Successfully" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CheckOrderExistence = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Order.aggregate([
    { $match: { UserId: ObjectID(filter.UserId) } },
    { $unwind: "$Items" },
    {
      $lookup: {
        from: "test_series",
        localField: "Items.TestSeries",
        foreignField: "_id",
        as: "TestSeries",
      },
    },
    {
      $match: {
        "TestSeries.Tests": ObjectID(filter.TestId),
      },
    },
  ])
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Order Found" });
      } else {
        return res.status(200).send({ message: "Order Found" });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
