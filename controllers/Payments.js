const Payment = require("../models/Payment");
const aqp = require("api-query-params");
const axios = require("axios");
const Order = require("../models/Orders");
const SendProgram = require("../models/SentPrograms");
const Notification = require("../models/Notifications");
const NotificationHandler = require("../utils/SendNotification")
const NotificationEvents =require("../constants/NotificationEvents")
const mongoose = require("mongoose");
const Client = require("../models/Clients");
const { CreateGeneralNotification } = require("./Notification");
const stripe = require('stripe')('sk_test_51NzgiTKrByvmoNXFBNMnoIYV2fWTAwgzKtW9tXB00vYibQcHMCKrxgTIhwxR48XxMf38pFgpjd5tbORcWNC1e95T00upfdzlOL');

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
  let NotificationObj=new NotificationHandler(req.app.get("socketService"))
  Order.findOne({
    "Program._id": req.body.programId,
    UserId: req.userData._id,
    Status: "Active",
  }).populate("SenderId").then((order) => {
    if (order) {
      res.status(501).send(order);
    } else {
      
     
        SendProgram.findOne({
          _id: req.body.id,
          $or: [
            { SendTo: req.userData.figgsId },
            { SendTo: req.userData.email },
          ],
          Amount: 0,
        }).populate("SenderId")
          .then(async(data) => {
            if(data){
             let clientId =''
                const client = await Client.findOne({ client: req.userData._id , instructor: data.Program.createdBy});
                if (client) {
                  // Client already exists, capture client ID
                   clientId = client._id;
                  // Continue with the rest of the code
                  // ...
                } else {
                  // Client does not exist, create a new one
                  const newClient = new Client({
                    client: req.userData._id,
                    instructor: data.Program.createdBy,
                    name: req.userData.name,
                    email: req.userData.email,
                    // Add any other required fields for the client
                  });
                  const createdClient = await newClient.save();
                  // Capture the client ID
                 clientId = createdClient._id;
                  // Continue with the rest of the code
                  // ...
                }
              

              const order = new Order({
                PaymentId: null,
                SubscriptionId: null,
                UserId: req.userData._id,
                Status: "Active",
                clientId: clientId,
                Program: data.Program,
                SentProgramId: data._id,
              });
              order
                .save()
  
                .then(async (result) => {

                  // Check if client exists
                  NotificationObj.sendNotification(
                    data.SenderId._id,
                    NotificationEvents.ACCEPT_PROGRAM,
                    {
                      To: [data.SenderId._id],
                      Type: NotificationEvents.ACCEPT_PROGRAM,
                      Sender: req.userData._id,
                      SentProgramId: data._id,
                      emailTitle:"Have accept the program",
                      email:data.SenderId.email,
                      profileImg:req.userData.profilePic,
                      profileName:req.userData.name,
                      programImg:data.Program.BannerImage,
                      programTitle:data.Program.Title,
                      message:"Your client have accepted the program you can now view, edit your client workouts and diet plan",
                      Link: `/clientProfile/${clientId}`,
                      Description:`Accepted ${data.Program.Title}`,
      
                    },
                    data.SenderId.email
                  )
                  NotificationObj.sendNotification(
                    req.userData._id,
                    NotificationEvents.ACCEPT_PROGRAM,
                    {
                      To: [req.userData._id],
                      Type: NotificationEvents.ACCEPT_PROGRAM,
                      Sender:  data.SenderId._id,
                      SentProgramId: data._id,
                      emailTitle:"Have accept the program",
                      email:req.userData.email,
                      profileImg:req.userData.profilePic,
                      profileName:req.userData.name,
                      programImg:data.Program.BannerImage,
                      programTitle:data.Program.Title,
                      Link:"/client",
                      Description:`${data.Program.Title} is now active `
                    },
                    req.userData.email,{
                      email:false,
                      inApp:true
                    }
                  )
          // CreateGeneralNotification(data.SenderId,req.userData._id,"accept-order",'',
          //   {
          //     UserId: data.SenderId,
          //     Link:`/clientProfile/${clientId}`,
          //     Type: "SubscribedProgram",
          //     Sender: req.userData._id,
          //     SentProgramId: data._id,
          // },req.app.get("socketService"))
                  // await Notification.create(
                  //   [
                  //     {
                  //       UserId: data.SenderId,
                  //       Link:`/clientProfile/${clientId}`,
                  //       Type: "SubscribedProgram",
                  //       Sender: req.userData._id,
                  //       SentProgramId: data._id,
                  //     },
                  //   ]
                  // );
                  // req.app.get("socketService").sendTo(data.SenderId, data.SenderId, {
                  //   type: "new-notification",
                  //   data: { name: req.userData.name, type: "sent-program" },
                  // });
                  return res.status(201).send({ message: "Order Created" , id:result._id});
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


exports.getStripeCustomer=async(req, res) => {
  try {
    // Fetch customer data from Stripe (you'll need to store and retrieve the customer ID)
    const customer = await stripe.customers.retrieve(req.userData.stripeUserId);
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.userData.stripeUserId,
      type: 'card', // You can specify the type if needed
    });
    res.status(200).send({ customer,paymentMethods:paymentMethods.data });
  } catch (error) {
    console.error('Error fetching customer data:', error);
    res.status(500).json({ error: 'Error fetching customer data.' });
  }


}

exports.addPaymentMethod=async(req, res) =>{
  try {
    const { token } = req.body;
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(token, { customer: req.userData.stripeUserId });
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.userData.stripeUserId,
      type: 'card', // You can specify the type if needed
    });
    res.status(200).send({paymentMethods:paymentMethods.data});
  } catch (error) {
    console.error('Error attaching payment method:', error);
    res.status(500).json({ error: 'Error attaching payment method.' });
  }
}

exports.setdefaultPaymentMethos=async(req, res) =>{
  try {
    const {  paymentMethodId } = req.body;

    // Set the default payment method for the customer
    await stripe.customers.update(req.userData.stripeUserId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    res.json({ success: true, message: 'Default payment method updated successfully.' });
  } catch (error) {
    console.error('Error marking payment method as default:', error);
    res.status(500).json({ success: false, error: 'Error marking payment method as default.' });
  }
}

exports.removePaymentMethod=async(req, res) =>{
  try {
    const {  token } = req.body;

    // Detach the payment method from the customer
    await stripe.paymentMethods.detach(token);

    // Fetch and return the updated customer's payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.userData.stripeUserId,
      type: 'card', // You can specify the type if needed
    });
    res.json({ success: true, message: 'Payment method removed successfully', paymentMethods:paymentMethods.data });
  } catch (error) {
    console.error('Error removing payment method:', error);
    res.status(500).json({ success: false, error: 'Error removing payment method.' });
  }
}