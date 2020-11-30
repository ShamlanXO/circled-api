const Program = require("../models/Programs");
const aqp = require("api-query-params");
const User = require("../models/user");
const SentProgram = require("../models/SentPrograms");
const Notification = require("../models/Notifications");
var ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const axios = require("axios");
exports.ProgramsAll = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Program.find({...filter,IsPublished:true}, { ExercisePlan: 0 })
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
  Program.find({ createdBy: req.userData._id }, { ExercisePlan: 0 }).sort({IsDraft:-1,createdAt:-1})
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
  let program = null;
  let sentProgram = null;
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
      let subscriptionId =null

      if(program[0].PaymentType=="Subscription"){
        subscriptionId = await axios.post(
        "https://api.sandbox.paypal.com/v1/billing/plans",

        {
          product_id:program[0].ProductId,
          name:program[0].Title,
          billing_cycles:[{
            frequency:{
              interval_unit:"MONTH",

          
          },
         
            pricing_scheme:{
              version:1,
            fixed_price:{
              "value":  program[0].Price,
              "currency_code": "USD"
            },
            
            
            
           
          
          
          },
           
          
        
            tenure_type:"REGULAR",
            sequence:1,
            total_cycles:0

          }],
          payment_preferences:{ 
            auto_bill_outstanding: true,
            payment_failure_threshold:1},

         
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
            SubscriptionId:subscriptionId?subscriptionId.data.id:""
          },
        ],
        { session: session }
      );

      await Notification.create(
        [
          {
            To: req.body.SendTo,

            Type: "SentProgram",
            Sender: sentProgram[0].SenderId,
            SentProgramId: sentProgram[0]._id,
          },
        ],
        {
          session: session,
        }
      );

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
          { _id: 1 }
        ).then((userData) => {
          console.log(userData);
          let dataChat = [];
          userData.map((item) => {
           if(item._id!==req.userData._id){dataChat.push({
              ReceiverId: item._id,
              SenderId: req.userData._id,
              SentProgramId: sentProgram[0]._id,
            });

            req.app
              .get("socketService")
              .sendTo(item._id, item._id, {
                type: "new-notification",
                data: { name: req.userData.name, type: "sent-program" },
              });
            console.log(userData);}
          });

          Chat.create(dataChat);
        });
        return res.status(201).send();
      } else {
        return res.status(500).send();
      }
    }
  } else {

    axios.post(
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
    ).then(prdata => {

      const ProgramCon = new Program({
        ...req.body,
        ProductId:prdata.data.id,
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
  
    }).catch((err=>{
      return res.status(500).send({ ErrorOccured: error });
    }))






  }
};

exports.SendProgram = async (req, res) => {
  let isSuccess = true;
  let program = null;
  let sentProgram = null;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // always pass session to find queries when the data is needed for the transaction session

    program = await Program.findOne({
      _id: req.body._id,
      createdBy: req.userData._id,
    }).session(session);

   
    let subscriptionId =null

    if(req.body.PaymentType=="Subscription"&&req.body.Price>0){

      subscriptionId = await axios.post(
      "https://api.sandbox.paypal.com/v1/billing/plans",

      {
        product_id:program.ProductId,
        name:program.Title,
        billing_cycles:[{
          frequency:{
            interval_unit:"MONTH",

        
        },
       
          pricing_scheme:{
            version:1,
          fixed_price:{
            "value":  req.body.Price,
            "currency_code": "USD"
          },
          
          
          
         
        
        
        },
         
        
      
          tenure_type:"REGULAR",
          sequence:1,
          total_cycles:0

        }],
        payment_preferences:{ 
          auto_bill_outstanding: true,
          payment_failure_threshold:1},

       
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
          Program: {...program.toObject(),...req.body},
          SubscriptionId:subscriptionId?subscriptionId.data.id:"",
          Amount: req.body.Price,
          SendTo: req.body.SendTo,
          SenderId: req.userData._id,
          Title: req.body.Title,
        },
      ],
      { session: session }
    );

    await Notification.create(
      [
        {
          To: req.body.SendTo,

          Type: "SentProgram",
          Sender: sentProgram[0].SenderId,
          SentProgramId: sentProgram[0]._id,
        },
      ],
      {
        session: session,
      }
    );

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
        { _id: 1 }
      ).then((userData) => {
        console.log(userData);
        let dataChat = [];
        userData.map((item) => {
          if(item._id!==req.userData._id){ dataChat.push({
            ReceiverId: item._id,
            SenderId: req.userData._id,
            SentProgramId: sentProgram[0]._id,
          });
          req.app
            .get("socketService")
            .sendTo(item._id, item._id, {
              type: "new-notification",
              data: { name: req.userData.name, type: "sent-program" },
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


exports.ShareProgram=(req,res) => {
  const token = jwt.sign(
        {  _id:req.params.Id},
        process.env.jwtSecret,
        { expiresIn:"7d" }
      );
res.status(200).send({token});
}






exports.DeleteProgram = (req, res) => {
  Program.deleteOne({ _id: req.params.id, createdBy: req.userData._id })
    .then((result) => {
      return res.status(200).send({ message: "Program  Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
