const Program = require("../models/Programs");
const aqp = require("api-query-params");
const User = require("../models/user");
const SentProgram = require("../models/SentPrograms");


const jwt = require("jsonwebtoken");
var ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const { startOfMonth, endOfMonth } = require("date-fns");
const axios = require("axios");
const { addTorecent } = require("./RecentController");
const NotificationHandler = require("../utils/SendNotification")
const NotificationEvents =require("../constants/NotificationEvents")
exports.ProgramsAll = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Program.find({
    ...filter,
    IsArchived:false,
    IsDraft: false,
    IsDeleted: false,
  })
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
          ServerResponse: result.map((i) => ({
            Title: i.Title,
            _id: i._id,
            BannerImage: i.BannerImage,
            createdAt: i.createdAt,
            Price: i.Price,
            Duration: i.Duration,
            Description: i.Description,
            weeks: i.ExercisePlan.length,
          })),
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

  Program.aggregate([
    {
      $match: { createdBy: ObjectID(req.userData._id) },
    },
    {
      $sort: { IsDraft: -1, updatedAt: -1 },
    },

    {
      $lookup: {
        from: "purchasedprograms",
        let: { program: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$Program._id", "$$program"] }],
              },
            },
          },
          {
            $group: {
              _id: "$clientId",

              count: { $sum: 1 },
            },
          },
        ],
        as: "clients",
      },
    },
    {
      $lookup: {
        from: "payments",
        let: {
          program: "$_id",
          endDate: endOfMonth(new Date()),
          startDate: startOfMonth(new Date()),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$ProgramId", "$$program"] },
                  { $lte: ["$createdAt", "$$endDate"] },
                  { $gte: ["$createdAt", "$$startDate"] },
                ],
              },
            },
          },
          {
            $group: {
              _id: "$ProgramId",

              sum: { $sum: "$Amount" },
            },
          },
        ],
        as: "payment",
      },
    },
    {
      $project: {
        Title: 1,
        _id: 1,
        clients: { $size: "$clients" },
        weeks: { $size: "$ExercisePlan.weeks" },
        IsDraft: 1,
        ProgramType: 1,
        payment: 1,
        IsArchived: 1,
        Price: 1,
        IsDeleted: 1,
        BannerImage: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ])

    // Program.find({ createdBy: req.userData._id }, { ExercisePlan: 0 }).sort({IsDraft:-1,updatedAt:-1})
    //   .populate("createdBy", "_id name profilePic")
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
      if (result?.length < 1) {
        return res.status(404).send({ message: "No Program Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Program Listing", item: result });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateProgram = async (req, res) => {
  let isSuccess = true;
  let program = null;
  let sentProgram = null;
  let NotificationObj=new NotificationHandler(req.app.get("socketService"))
  if (req.body.SendTo.length > 0) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // always pass session to find queries when the data is needed for the transaction session

      let productId = await axios.post(
        "https://api.sandbox.paypal.com/v1/catalogs/products",

        {
          name: req.body.Title,
          type: "DIGITAL",
        },

        {
          headers: {
            Authorization:
              "Basic QVFBRWJHOGJmX0FTZGg2S1RtUUpZUGlIVzBsaUtHMXJiVXhNZF8tS3IzbGt4MDN2akV4SDBRNGR0MHg2OGRLQ0tlSFlZYmF4dFpwSnk1Ry06RUFzYVZTVkhIYWpSSGdlTnFjT3NBZldRY2xPV1IyRFpIYkd3MFFNcEFrZ19hVzktUnhxYjVQamlTUnVLNGNMelJGZnRLQnVmTi1mMFJ5RmY=",
            "Content-Type": "application/json",
          },
        }
      );

      program = await Program.create(
        [
          {
            ...req.body,
            createdBy: req.userData._id,
            ProductId: productId.data.id,
          },
        ],
        {
          session: session,
        }
      );
      let subscriptionId = null;

      if (program[0].PaymentType == "Subscription") {
        subscriptionId = await axios.post(
          "https://api.sandbox.paypal.com/v1/billing/plans",

          {
            product_id: program[0].ProductId,
            name: program[0].Title,
            billing_cycles: [
              {
                frequency: {
                  interval_unit: "MONTH",
                },

                pricing_scheme: {
                  version: 1,
                  fixed_price: {
                    value: program[0].Price,
                    currency_code: "USD",
                  },
                },

                tenure_type: "REGULAR",
                sequence: 1,
                total_cycles: 0,
              },
            ],
            payment_preferences: {
              auto_bill_outstanding: true,
              payment_failure_threshold: 1,
            },
          },

          {
            headers: {
              Authorization:
                "Basic QVFBRWJHOGJmX0FTZGg2S1RtUUpZUGlIVzBsaUtHMXJiVXhNZF8tS3IzbGt4MDN2akV4SDBRNGR0MHg2OGRLQ0tlSFlZYmF4dFpwSnk1Ry06RUFzYVZTVkhIYWpSSGdlTnFjT3NBZldRY2xPV1IyRFpIYkd3MFFNcEFrZ19hVzktUnhxYjVQamlTUnVLNGNMelJGZnRLQnVmTi1mMFJ5RmY=",
              "Content-Type": "application/json",
            },
          }
        );
      }
      sentProgram = await SentProgram.create(
        [
          {
            Program: program[0],
            Amount: req.body.Price,
            SendTo: req.body.SendTo,
            SenderId: req.userData._id,
            Title: program[0].Title,
            SubscriptionId: subscriptionId ? subscriptionId.data.id : "",
          },
        ],
        { session: session }
      );

      // await Notification.create(
      //   [
      //     {
      //       To: req.body.SendTo,

      //       Type: "SentProgram",
      //       Sender: sentProgram[0].SenderId,
      //       SentProgramId: sentProgram[0]._id,
      //     },
      //   ],
      //   {
      //     session: session,
      //   }
      // );

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
        User.find(
          {
            $or: [
              { email: { $in: req.body.SendTo } },
              { figgsId: { $in: req.body.SendTo } },
            ],
          },
          { _id: 1, email: 1 }
        ).then((userData) => {
          let dataChat = [];
          if (userData.length > 0)
            userData.map((item) => {
              if (item._id !== req.userData._id) {
                dataChat.push({
                  ReceiverId: item._id,
                  SenderId: req.userData._id,
                  SentProgramId: sentProgram[0]._id,
                });
                if (item.email) {
                  addTorecent("sendProgram", {
                    programId: program[0]._id,
                    userId: req.userData._id,
                    email: item.email,
                    clientId: item._id,
                  });
                  req.body.SendTo = req.body.SendTo.filter(
                    (i) => i !== item.email
                  );
                  NotificationObj.sendNotification(item._id,NotificationEvents.SEND_PROGRAM,{
                    To: [item._id],
                    Type: NotificationEvents.SEND_PROGRAM,
                    Sender: sentProgram[0].SenderId,
                    SentProgramId: sentProgram[0]._id,
                    emailTitle:"Sent you a program",
                    email:item.email,
                    profileImg:req.userData.profilePic,
                    profileName:req.userData.name,
                    programImg:req.body.BannerImage,
                    programTitle:req.body.Title,
                    message:req.body.GreetingMessage,
                    Link: "/program/instructorSend/" +
                    sentProgram[0]._id +
                    "/" +
                    item.email,
    
                  },item.email)
                  // sendPromoMain({
                  //   email: item.email,
                  //   name: req.userData.name,
                  //   BannerImage: req.body.BannerImage
                  //     ? req.body.BannerImage
                  //     : "https://ik.imagekit.io/figgs/undefined1652090574514_stCrUjSEJ?ik-sdk-version=javascript-1.4.3&updatedAt=1652090576050",
                  //   profileImg: req.userData.profilePic
                  //     ? req.userData.profilePic
                  //     : "https://ik.imagekit.io/figgs/Male_XGOm4LEno.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655045544491",
                  //   Title: req.body.Title,
                  //   description: req.body.Description,
                  //   GreetingMessage: req.body.GreetingMessage
                  //     ? req.body.GreetingMessage
                  //     : "No message from the trainer",
                  //   Price: req.body.Price ? req.body.Price : "N/A",
                  //   PaymentType: req.body.PaymentType
                  //     ? req.body.PaymentType
                  //     : "N/A",
                  //   Link:
                  //     "https://circled.fit/program/instructorSend/" +
                  //     sentProgram[0]._id +
                  //     "/" +
                  //     item.email,
                  // });
                }

                // req.app.get("socketService").sendTo(item._id, item._id, {
                //   type: "new-notification",
                //   data: { name: req.userData.name, type: "sent-program" },
                // });
              }
            });

          req.body.SendTo.filter(
            (eitem) => userData.find((ud) => ud.email === eitem) == null
          ).map(async (item) => {
            if (item.includes("@")) {
              let token = await jwt.sign(
                { uuid: item.toLowerCase(), type: "email" },
                "s3cr3t",
                { expiresIn: "1d" }
              );
              NotificationObj.sendNotification(item._id,NotificationEvents.SEND_PROGRAM,{
                To: [item._id],
                Type: NotificationEvents.SEND_PROGRAM,
                Sender: sentProgram[0].SenderId,
                SentProgramId: sentProgram[0]._id,
                emailTitle:"Sent you a program",
                email:item,
                profileImg:req.userData.profilePic,
                profileName:req.userData.name,
                programImg:req.body.BannerImage,
                programTitle:req.body.Title,
                message:req.body.GreetingMessage,
                Link: "/program/instructorSend/" +
                sentProgram[0]._id +
                "/" +
                item,

              },item)
              // sendPromoMain({
              //   email: item,
              //   name: req.userData.name,
              //   description: req.body.Description,
              //   BannerImage: req.body.BannerImage
              //     ? req.body.BannerImage
              //     : "https://ik.imagekit.io/figgs/undefined1652090574514_stCrUjSEJ?ik-sdk-version=javascript-1.4.3&updatedAt=1652090576050",
              //   profileImg: req.userData.profilePic
              //     ? req.userData.profilePic
              //     : "https://ik.imagekit.io/figgs/email/Male_soSSHMqHN.png?ik-sdk-version=javascript-1.4.3&updatedAt=1667477819527",
              //   Title: req.body.Title,
              //   GreetingMessage: req.body.GreetingMessage
              //     ? req.body.GreetingMessage
              //     : "No message from the trainer",
              //   Price: req.body.Price ? req.body.Price : "N/A",
              //   PaymentType: req.body.PaymentType
              //     ? req.body.PaymentType
              //     : "N/A",
              //   Link:
              //     "https://figgs.co/public/payment/" +
              //     sentProgram[0]._id +
              //     "/" +
              //     item +
              //     "/" +
              //     token,
              // });
              addTorecent("sendProgram", {
                programId: program[0]._id,
                userId: req.userData._id,
                email: item,
              });
            }
          });

          Chat.create(dataChat);
        });
        return res.status(201).send();
      } else {
        return res.status(500).send();
      }
    }
  } else {
    axios
      .post(
        "https://api.sandbox.paypal.com/v1/catalogs/products",

        {
          name: req.body.Title,
          type: "DIGITAL",
        },

        {
          headers: {
            Authorization:
              "Basic QVFBRWJHOGJmX0FTZGg2S1RtUUpZUGlIVzBsaUtHMXJiVXhNZF8tS3IzbGt4MDN2akV4SDBRNGR0MHg2OGRLQ0tlSFlZYmF4dFpwSnk1Ry06RUFzYVZTVkhIYWpSSGdlTnFjT3NBZldRY2xPV1IyRFpIYkd3MFFNcEFrZ19hVzktUnhxYjVQamlTUnVLNGNMelJGZnRLQnVmTi1mMFJ5RmY=",
            "Content-Type": "application/json",
          },
        }
      )
      .then((prdata) => {
        const ProgramCon = new Program({
          ...req.body,
          ProductId: prdata.data.id,
          createdBy: req.userData._id,
        });
        ProgramCon.save()
          .then((result) => {
            return res
              .status(201)
              .send({ Message: "Program Created", item: result });
          })
          .catch((error) => {
            return res.status(500).send({ ErrorOccured: error });
          });
      })
      .catch((err) => {
        return res.status(500).send({ ErrorOccured: err });
      });
  }
};

exports.SendProgram = async (req, res) => {
  let isSuccess = true;
  let program = null;
  let sentProgram = null;
  let NotificationObj=new NotificationHandler(req.app.get("socketService"))
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // always pass session to find queries when the data is needed for the transaction session

    program = await Program.findOne({
      _id: req.body._id,
      createdBy: req.userData._id,
    }).session(session);

    let subscriptionId = null;

    if (req.body.PaymentType == "Subscription" && req.body.Price > 0) {
      subscriptionId = await axios.post(
        "https://api.sandbox.paypal.com/v1/billing/plans",

        {
          product_id: program.ProductId,
          name: program.Title,
          billing_cycles: [
            {
              frequency: {
                interval_unit: "MONTH",
              },

              pricing_scheme: {
                version: 1,
                fixed_price: {
                  value: req.body.Price,
                  currency_code: "USD",
                },
              },

              tenure_type: "REGULAR",
              sequence: 1,
              total_cycles: 0,
            },
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            payment_failure_threshold: 1,
          },
        },

        {
          headers: {
            Authorization:
              "Basic QVFBRWJHOGJmX0FTZGg2S1RtUUpZUGlIVzBsaUtHMXJiVXhNZF8tS3IzbGt4MDN2akV4SDBRNGR0MHg2OGRLQ0tlSFlZYmF4dFpwSnk1Ry06RUFzYVZTVkhIYWpSSGdlTnFjT3NBZldRY2xPV1IyRFpIYkd3MFFNcEFrZ19hVzktUnhxYjVQamlTUnVLNGNMelJGZnRLQnVmTi1mMFJ5RmY=",
            "Content-Type": "application/json",
          },
        }
      );
    }

    sentProgram = await SentProgram.create(
      [
        {
          Program: { ...program.toObject(), ...req.body },
          SubscriptionId: subscriptionId ? subscriptionId.data.id : "",
          Amount: req.body.Price,
          SendTo: req.body.SendTo,
          SenderId: req.userData._id,
          Title: req.body.Title,
        },
      ],
      { session: session }
    );

    // await Notification.create(
    //   [
    //     {
    //       To: req.body.SendTo,

    //       Type: "SentProgram",
    //       Sender: sentProgram[0].SenderId,
    //       SentProgramId: sentProgram[0]._id,
    //     },
    //   ],
    //   {
    //     session: session,
    //   }
    // );

    // await Chat.create([{
    //   ReceiverId:item._id,
    //             SenderId:req.userData._id,
    //             SentProgramId:sentProgram[0]._id
    // }])

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
      User.find(
        {
          $or: [
            { email: { $in: req.body.SendTo } },
            { figgsId: { $in: req.body.SendTo } },
          ],
        },
        { _id: 1, email: 1 }
      ).then((userData) => {
        let dataChat = [];
        if (userData.length > 0)
          userData.map((item) => {
            if (item.email) {
              addTorecent("sendProgram", {
                programId: program._id,
                userId: req.userData._id,
                email: item.email,
                clientId: item._id,
              });
              req.body.SendTo = req.body.SendTo.filter((i) => i !== item.email);
              NotificationObj.sendNotification(item._id,NotificationEvents.SEND_PROGRAM,{
                To: [item._id],
                Type: NotificationEvents.SEND_PROGRAM,
                Sender: sentProgram[0].SenderId,
                SentProgramId: sentProgram[0]._id,
                emailTitle:"Sent you a program",
                email:item.email,
                profileImg:req.userData.profilePic,
                profileName:req.userData.name,
                programImg:req.body.BannerImage,
                programTitle:req.body.Title,
                message:req.body.GreetingMessage,
                Link: "/program/instructorSend/" +
                sentProgram[0]._id +
                "/" +
                item.email,

              },item.email)
              // sendPromoMain({
              //   email: item.email,
              //   name: req.userData.name,
              //   description: req.body.Description,
              //   BannerImage: req.body.BannerImage
              //     ? req.body.BannerImage
              //     : "https://ik.imagekit.io/figgs/undefined1652090574514_stCrUjSEJ?ik-sdk-version=javascript-1.4.3&updatedAt=1652090576050",
              //   profileImg: req.userData.profilePic
              //     ? req.userData.profilePic
              //     : "https://ik.imagekit.io/figgs/Male_XGOm4LEno.png?ik-sdk-version=javascript-1.4.3&updatedAt=1655045544491",
              //   Title: req.body.Title,
              //   GreetingMessage: req.body.GreetingMessage
              //     ? req.body.GreetingMessage
              //     : "No message from the trainer",
              //   Price: req.body.Price ? req.body.Price : "N/A",
              //   PaymentType: req.body.PaymentType
              //     ? req.body.PaymentType
              //     : "N/A",
              //   Link:
              //     "https://circled.fit/program/instructorSend/" +
              //     sentProgram[0]._id +
              //     "/" +
              //     item.email,
              // });
            }

            if (item._id !== req.userData._id) {
              dataChat.push({
                ReceiverId: item._id,
                SenderId: req.userData._id,
                SentProgramId: sentProgram[0]._id,
              });

              Chat.create([
                {
                  ReceiverId: item._id,
                  SenderId: req.userData._id,
                  SentProgramId: sentProgram[0]._id,
                },
              ]).then((createdChats) => {
                // createdChats.map((chatItem) => {
                //   req.app.get("socketService").sendTo(item._id, item._id, {
                //     type: "new-message",
                //     data: {
                //       name: req.userData.name,
                //       ReceiverId: item._id,
                //       _id: chatItem._id,
                //       SenderId: req.userData._id,
                //       SentProgramId: sentProgram[0],
                //     },
                //   });
                // });
              });

              req.app.get("socketService").sendTo(item._id, item._id, {
                type: "new-notification",
                data: { name: req.userData.name, type: "sent-program" },
              });
            }
          });

        req.body.SendTo.filter(
          (eitem) => userData.find((ud) => ud.email === eitem) == null
        ).map(async (item) => {
          addTorecent("sendProgram", {
            programId: program._id,
            userId: req.userData._id,
            email: item,
          });
          if (item.includes("@")) {
            let token = await jwt.sign(
              { uuid: item.toLowerCase(), type: "email" },
              "s3cr3t",
              { expiresIn: "1d" }
            );
            NotificationObj.sendNotification(item._id,NotificationEvents.SEND_PROGRAM,{
              To: [item],
              Type: NotificationEvents.SEND_PROGRAM,
              Sender: sentProgram[0].SenderId,
              SentProgramId: sentProgram[0]._id,
              emailTitle:"Sent you a program",
              email:item,
              profileImg:req.userData.profilePic,
              profileName:req.userData.name,
              programImg:req.body.BannerImage,
              programTitle:req.body.Title,
              message:req.body.GreetingMessage,
              Link: "/program/instructorSend/" +
              sentProgram[0]._id +
              "/" +
              item,

            },item)
           
          }
        });
      });

      return res.status(201).send();
    } else {
      return res.status(500).send();
    }
  }


};

exports.UpdateProgram = (req, res) => {
  console.log(req.body);
  delete req.body.createdBy;
  Program.updateOne(
    { createdBy: req.userData._id, _id: req.body._id },
    { ...req.body }
  )
    .then((result) => {
      if (req.body.SendTo && req.body.SendTo?.length)
        this.SendProgram(req, res);
      else return res.status(200).send({ message: "Program Updated" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.ShareProgram = (req, res) => {
  const token = jwt.sign({ _id: req.params.Id }, process.env.jwtSecret, {
    expiresIn: "7d",
  });
  res.status(200).send({ token });
};

exports.DeleteProgram = (req, res) => {
  Program.updateOne({ _id: req.params.id }, { IsDeleted: true })
    .then((result) => {
      return res.status(200).send({ message: "Program  Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.ArchiveProgram = (req, res) => {
  Program.updateOne(
    { _id: req.params.id },
    { IsArchived: true, IsPublished: false }
  )
    .then((result) => {
      return res.status(200).send({ message: "Program  Archived" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UnArchiveProgram = (req, res) => {
  Program.updateOne({ _id: req.params.id }, { IsArchived: false })
    .then((result) => {
      return res.status(200).send({ message: "Program  UnArchived" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DuplicateProgram = (req, res) => {
  Program.findOne({ _id: req.params.id })
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: "No Program Found" });
      } else {
        const newProgram = new Program({
          ...result.toObject(),
          Title: result.Title + " - Copy",
          _id: new ObjectID(),
        });
        newProgram.save().then((result) => {
          return res.status(201).send({ message: "Program Duplicated",program:result });
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
}
