const Payment = require("../models/Payment");
const aqp = require("api-query-params");
const axios = require("axios");
const Order = require("../models/Orders");
const SendProgram = require("../models/SentPrograms");
const Notification = require("../models/Notifications");
const mongoose = require("mongoose");
exports.createSubscription = (req, res) => {
  Order.findOne({
    SentProgramId: req.body.id,
    UserId: req.userData._id,
    Status: "Active",
  }).then((order) => {
    if (order) {
      res.status(501).send();
    } else {

      SendProgram.findOne({
        _id: req.body.id,
        $or: [{ SendTo: req.userData.figgsId }, { SendTo: req.userData.email }],
      })
        .then((data) => {
          if (data) {
            axios
              .post(
                "https://api.sandbox.paypal.com/v1/billing/subscriptions",
                {
                  plan_id: data.SubscriptionId,
                },
                { headers: { Authorization: process.env.paypalToken } }
              )
              .then((subData) => {
                const payment = new Payment({
                  Amount: data.Amount,
                  User: req.userData._id,
                  SubscriptionId: subData.data.id,
                  SendProgramId: data._id,
                  Status: "Pending",
                  Type: "Subscription",
                  paymentDetails: subData.data,
                });
    
                payment
                  .save()
                  .then((result) => {
                    return res.status(201).send({
                      message: "Subscription Created",
                      id: subData.data.id,
                    });
                  })
                  .catch((error) => {
                    console.log("payment error");
                    return res.status(500).send({ ErrorOccured: error });
                  });
              })
              .catch((error) => {
                console.log("paypal error");
    
                return res.status(500).send({ error: "paypal error" });
              });
          } else {
            console.log("send error");
            res.status(500).send({ message: "server error" });
          }
        })
        .catch((error) => {
          console.log("send error");
          return res.status(500).send({ ErrorOccured: error });
        });


    }
  }).catch((err) =>{
    return res.status(500).send({ error: "server eroror error" });
  })


 
};

exports.ApproveSubscription = (req, res) => {
  Payment.findOne({ SubscriptionId: req.body.id })
    .populate("SendProgramId")
    .then((paymentData) => {
      if (paymentData) {
        axios
          .get(
            `https://api.sandbox.paypal.com/v1/billing/subscriptions/${req.body.id}`,

            { headers: { Authorization: process.env.paypalToken } }
          )
          .then((subData) => {
            if (subData.data.status === "ACTIVE") {
              Order.updateOne(
                { PaymentId: paymentData._id },
                {
                  PaymentId: paymentData._id,
                  SubscriptionId: req.body.id,
                  UserId: req.userData._id,
                  Status: "Active",
                  Program: paymentData.SendProgramId.Program,
                  SentProgramId: paymentData.SendProgramId._id,
                },
                { upsert: true }
              )

                .then((result) => {
                  return res.status(201).send({ message: "Order Created" });
                })
                .catch((error) => {
                  return res.status(500).send({ ErrorOccured: error });
                });
              Payment.updateOne(
                { SubscriptionId: req.body.id },
                { Status: "Active", paymentDetails: subData.data }
              );
            } else {
              res.status(501).send();
            }
          })
          .catch((err) => {
            res.status(500).send();
          });
      } else {
        res.status(404).send();
      }
    })
    .catch((error) => res.status(500).send());
};

exports.createOrder = (req, res) => {
  Order.findOne({
    SentProgramId: req.body.id,
    UserId: req.userData._id,
    Status: "Active",
  }).then((order) => {
    if (order) {
      res.status(501).send();
    } else {
      SendProgram.findOne({
        _id: req.body.id,
        $or: [{ SendTo: req.userData.figgsId }, { SendTo: req.userData.email }],
      })
        .then((data) => {
          if (data) {
            axios
              .post(
                "https://api.sandbox.paypal.com/v2/checkout/orders",
                {
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: data.Amount,
                      },
                      description: data.Title,
                    },
                  ],
                  application_context: { brand_name: "Figgs" },
                },
                { headers: { Authorization: process.env.paypalToken } }
              )
              .then((orderData) => {
                const payment = new Payment({
                  Amount: data.Amount,
                  User: req.userData._id,
                  OrderId: orderData.data.id,
                  SendProgramId: data._id,
                  Status: "Pending",
                  Type: "OneTime",
                  paymentDetails: {},
                });

                payment
                  .save()
                  .then((result) => {
                    return res.status(201).send({
                      message: "Order Created",
                      id: orderData.data.id,
                    });
                  })
                  .catch((error) => {
                    console.log("payment error");
                    return res.status(500).send({ ErrorOccured: error });
                  });
              })
              .catch((error) => {
                console.log(error.response.data);
                console.log("paypal error");

                return res.status(500).send({ error: "paypal error" });
              });
          } else {
            console.log("send error");
            res.status(500).send({ message: "server error" });
          }
        })
        .catch((error) => {
          console.log("send error");
          return res.status(500).send({ ErrorOccured: error });
        });
    }
  });
};

exports.ApproveOrder = (req, res) => {
  Payment.findOne({ OrderId: req.body.id })
    .populate("SendProgramId")
    .then((paymentData) => {
      if (paymentData) {
        axios
          .get(
            `https://api.sandbox.paypal.com/v2/checkout/orders/${req.body.id}`,

            { headers: { Authorization: process.env.paypalToken } }
          )
          .then((orderData) => {
            if (
              orderData.data.status === "APPROVED" ||
              orderData.data.status === "COMPLETED"
            ) {
              Order.updateOne(
                { PaymentId: paymentData._id },
                {
                  PaymentId: paymentData._id,
                  SubscriptionId: null,
                  UserId: req.userData._id,
                  Status: "Active",
                  Program: paymentData.SendProgramId.Program,
                  SentProgramId: paymentData.SendProgramId._id,
                },
                { upsert: true }
              )

                .then(async(result) => {


                  await Notification.create(
                    [
                      {
                       UserId:paymentData.SendProgramId.SenderId,
            
                        Type: "SubscribedProgram",
                        Sender: req.userData._id,
                        SentProgramId: paymentData.SendProgramId._id,
                      },
                    ]
                  );
                  req.app.get("socketService").sendTo(paymentData.SendProgramId.SenderId, paymentData.SendProgramId.SenderId, {
                    type: "new-notification",
                    data: { name: req.userData.name, type: "sent-program" },
                  });
                  return res.status(201).send({ message: "Order Created" });
                })
                .catch((error) => {
                  return res.status(500).send({ ErrorOccured: error });
                });
              Payment.updateOne(
                { OrderId: req.body.id },
                { Status: "Active", paymentDetails: orderData.data }
              );
            } else {
              res.status(501).send();
            }
          })
          .catch((err) => {
            res.status(500).send();
          });
      } else {
        res.status(404).send();
      }
    })
    .catch((error) => res.status(500).send());
};

exports.AddFreeOrder = (req, res) => {
  Order.findOne({
    SentProgramId: req.body.id,
    UserId: req.userData._id,
    Status: "Active",
  }).then((order) => {
    if (order) {
      res.status(501).send();
    } else {
      
     
        SendProgram.findOne({
          _id: req.body.id,
          $or: [
            { SendTo: req.userData.figgsId },
            { SendTo: req.userData.email },
          ],
          Amount: 0,
        })
          .then((data) => {
            if(data){
              const order = new Order({
                PaymentId: null,
                SubscriptionId: null,
                UserId: req.userData._id,
                Status: "Active",
                Program: data.Program,
                SentProgramId: data._id,
              });
              order
                .save()
  
                .then(async (result) => {
                  await Notification.create(
                    [
                      {
                        UserId: data.SenderId,
            
                        Type: "SubscribedProgram",
                        Sender: req.userData._id,
                        SentProgramId: data._id,
                      },
                    ]
                  );
                  req.app.get("socketService").sendTo(data.SenderId, data.SenderId, {
                    type: "new-notification",
                    data: { name: req.userData.name, type: "sent-program" },
                  });
                  return res.status(201).send({ message: "Order Created" });
                })
                .catch((error) => {
                  console.log("order create error")
                  return res.status(500).send({ ErrorOccured: error });
                });
            }
            else{
              console.log("not found")
              return res.status(500).send({ ErrorOccured: "" });
            }
          
          })
          .catch((error) => {
            console.log(error)
            console.log("send error")
            return res.status(500).send({ ErrorOccured: error });
          });
      
    }
  }).catch((error) => {
    console.log(error)
    console.log("no order error")
    return res.status(500).send({ ErrorOccured: error });
  });
};


exports.Unsubscribe=(req,res)=>{
  Payment.findOne({ SubscriptionId: req.body.id,User: req.userData._id}).then(data=>{
    if(data){
      console.log(data)
      axios
      .post(
        `https://api.sandbox.paypal.com/v1/billing/subscriptions/${req.body.id}/cancel`,
        {reason:"not satisfied"},

        { headers: { Authorization: process.env.paypalToken } }
      )
      .then((subData) => {

Payment.updateOne({ SubscriptionId: req.body.id},{Status:"Unsubscribed"}).then(resPay=>{

  if(resPay.nModified>0)
  res.status(200).send()
  else
  res.status(500).send()
  Order.updateOne({SubscriptionId:req.body.id},{Status:"Inactive"}).then(resOrd=>{
    if(resOrd.nModified>0)
    res.status(200).send()
    else
    res.status(500).send()
  })
})




      }).catch((err)=>{
        console.log(err.response.data)
        res.status(500).send()
      })
    }
    else
    {
      res.status(500).send()
    }
  }).catch((err)=>{
    res.status(500).send()
  })
}