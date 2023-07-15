const Order = require("../models/Orders");
const aqp = require("api-query-params");
const BodyImageModel = require("../models/BodyImages");
var ObjectID = require("mongodb").ObjectID;
const diff = require("diff-arrays-of-objects");
const { detailedDiff } = require("deep-object-diff");
const { CreateGeneralNotification } = require("./Notification");
exports.SearchOrder = (req, res) => {
  Order.find(
    { UserId: req.userData._id, Status: "Active" },
    "_id isActive Program.Title Program.createdBy Program.BannerImage createdAt"
  )
    .populate("Program.createdBy", "name profilePic _id")
    .then((result) => {
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
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.CreateOrder = (req, res) => {
  console.log("Sdsd");
  const order = new Order({ ...req.body, UserId: req.userData._id });
  order
    .save()
    .then((result) => {
      return res
        .status(201)
        .send({ message: "Order Created", ServerResponse: result });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.GetAllClients = (req, res) => {
  Order.aggregate([
    {
      $match: {
        "Program.createdBy": ObjectID(req.userData._id),
        UserId: { $ne: ObjectID(req.userData._id) },
      },
    },

    {
      $group: {
        _id: "$UserId",
        program: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "program.UserId",
        foreignField: "_id",
        as: "clientData",
      },
    },
    {
      $project: {
        _id: "$_id",
        program: "$program",
        clientData: { $first: "$clientData" },
      },
    },
    {
      $project: {
        _id: "$_id",
        userId: "$clientData._id",
        name: "$clientData.name",
        program: "$program.Program.Title",
        isActive: "$program.isActive",
        profilePic: "$clientData.profilePic",
      },
    },
  ])

    // Order.find(
    //   { "Program.createdBy": req.userData._id, isActive: true },
    //   { "Program.ExercisePlan": 0 }
    // )
    //   .populate("UserId", "name profilePic _id")
    .then((result) => {
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
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.GetClients = (req, res) => {
  Order.aggregate([
    {
      $match: {
        "Program.createdBy": ObjectID(req.userData._id),
      },
    },

    {
      $sort: { isActive: -1 },
    },
    {
      $group: {
        _id: "$UserId",
        program: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "program.UserId",
        foreignField: "_id",
        as: "clientData",
      },
    },
    {
      $project: {
        _id: "$_id",
        program: "$program",
        clientData: { $first: "$clientData" },
      },
    },
    {
      $project: {
        _id: "$program._id",
        userId: "$clientData._id",
        name: "$clientData.name",
        figgsId: "$clientData.figgsId",
        program: "$program.Program.Title",
        isActive: "$program.isActive",
        profilePic: "$clientData.profilePic",
      },
    }
  ])

    // Order.find(
    //   { "Program.createdBy": req.userData._id, isActive: true },
    //   { "Program.ExercisePlan": 0 }
    // )
    //   .populate("UserId", "name profilePic _id")
    .then((result) => {
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
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.GetClientsSpecificProgram = (req, res) => {
  Order.find(
    {
      "Program.createdBy": req.userData._id,
      //isActive: true,
      "Program._id": req.params.id,
    },
    { UserId: 1 }
  )
    .populate("UserId", "name profilePic figgsId _id createdAt")
    .then((result) => {
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
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.GetSpecificClients = async (req, res) => {
 
  Order.findOne({
    $or: [{ _id: req.params.Id }, { UserId: req.params.Id }],
 
    "Program.createdBy": req.userData._id,
  })
    .populate("UserId", "-password")
    .then(async(result) => {
      const Biresult = await BodyImageModel.find({ createdBy: result.UserId._id });
      if (!result) {
        return res.status(404).send({
          message: "No order Found",
        });
      } else {
        return res.status(200).send({
          message: "List of users",
          clientData: result,
          bodyImages: Biresult,
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.GetOrder = (req, res) => {
  console.log("getting order");
  Order.findOne({
    UserId: req.userData._id,
    _id: req.params.id,
    Status: "Active",
  })
    .populate("Program.createdBy", "name profilePic figgsId _id")
    .populate("SentProgramId")
    .then((result) => {
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
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.CheckExist = (req, res) => {
  const { UserId, CourseId } = req.query;
  Order.find({ UserId: UserId, "Items.Course": CourseId })

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

exports.UpdateOrder = async (req, res) => {
  let orderData = await Order.findById(req.body._id).populate("UserId").lean();

  Order.updateOne(
    { _id: req.body._id, "Program.createdBy": req.userData._id },
    req.body?.Program
      ? { Program: req.body?.Program }
      : { todo: req.body.todo || [] },
    function (err, response) {
      if (err) {
        return res.status(500).send({ ErrorOccured: error });
      }
      if (response) {
        if (req.body?.Program) {
          let prdiff = detailedDiff(
            JSON.parse(JSON.stringify(orderData.Program)),
            req.body.Program
          );
          if (
            prdiff.updated?.DietPlan?.Description ||
            prdiff.added?.DietPlan?.Description
          ) {
            CreateGeneralNotification(
              orderData.UserId._id,
              req.userData,
              "edited-diet",
              ``,
              {
                ...prdiff,
                OrderId: req.body._id,
                planName: orderData.Program.Title,
                email: orderData.UserId.email,
                socket: req.app.get("socketService"),
              }
            );
          }

          if (
            prdiff.updated?.ExercisePlan ||
            prdiff.added?.ExercisePlan ||
            prdiff.deleted?.ExercisePlan
          ) {
            CreateGeneralNotification(
              orderData.UserId._id,
              req.userData,
              "update-program",
              ``,
              {
                ...prdiff,
                OrderId: req.body._id,
                planName: orderData.Program.Title,
                email: orderData.UserId.email,
                socket: req.app.get("socketService"),
              }
            );
          }
        } else {
          let todoDiff = diff(
            orderData?.todo?.map((i) => ({ ...i, _id: String(i._id) })) || [],
            req.body.todo.map((i) => {
              delete i.edit;
              return i;
            }) || [],
            "_id"
          );
          CreateGeneralNotification(
            orderData.UserId._id,
            req.userData,
            "update-todo",
            ``,
            {
              ...todoDiff,
              OrderId: req.body._id,
              email: orderData.UserId.email,
              socket: req.app.get("socketService"),
            }
          );
        }

        return res.status(200).send({ message: "Order Details Updated" });
      }
    }
  ).catch((error) => {
    return res.status(500).send({ ErrorOccured: error });
  });
};

exports.UpdateTodo = (req, res) => {
  Order.updateOne(
    { _id: req.body._id, UserId: req.userData._id },
    { todo: req.body.todo || [] },
    function (err, response) {
      if (err) {
        return res.status(500).send({ ErrorOccured: error });
      }
      if (response) {
        console.log(response);
        return res.status(200).send({ message: "Order Details Updated" });
      }
    }
  ).catch((error) => {
    return res.status(500).send({ ErrorOccured: error });
  });
};

exports.updateStatus = (req, res) => {
  console.log(req.body);
  Order.updateOne(
    { _id: req.body._id, UserId: req.userData._id },
    { ...req.body },
    function (err, response) {
      if (err) {
        return res.status(500).send({ ErrorOccured: error });
      }
      if (response) {
        console.log(response);
        return res.status(200).send({ message: "Order Details Updated" });
      }
    }
  ).catch((error) => {
    return res.status(500).send({ ErrorOccured: error });
  });
};

exports.SwitchProgram = (req, res) => {
  let { _id, isActive } = req.body;
  if (isActive)
    Order.findOne({ _id: _id, UserId: req.userData._id })
      .populate("Program.createdBy")
      .then((order) => {
        console.log(order);
        Order.updateMany(
          { UserId: req.userData._id },
          { isActive: false }
        ).then((res) => {
          Order.updateOne(
            { _id: _id, UserId: req.userData._id },
            { isActive }
          ).then((response) => {});
        });

        return res.status(200).send({ data: order });
      })
      .catch((error) => res.status(500));
  else
    Order.updateMany({ UserId: req.userData._id }, { isActive: false }).then(
      (res1) => {
        Order.updateOne(
          { _id: _id, UserId: req.userData._id },
          { isActive }
        ).then((res2) => {
          return res.status(200).send({ data: "updated" });
        });
      }
    );
};

exports.GetStats = (req, res) => {
  console.log(req.params.id);
  Order.aggregate([
    {
      $match: {
        "Program._id": ObjectID(req.params.id),
        "Program.createdBy": ObjectID(req.userData._id),
      },
    },
    {
      $facet: {
        clients: [
          {
            $match: { isActive: true },
          },
          {
            $group: {
              _id: 1,
              totalAmount: { $sum: "$Program.Price" },
              count: { $sum: 1 },
            },
          },
        ],

        total: [
          {
            $group: {
              _id: 1,
              totalAmount: { $sum: "$Program.Price" },
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ])
    .then((data) => {
      if (data) return res.status(200).send(data[0]);
      else return res.status(404).send({ ErrorOccured: error });
    })
    .catch((error) => {
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
