

const aqp = require("api-query-params");
const SentProgram = require("../models/SentPrograms");
const Order = require("../models/Orders");
const Program = require("../models/Programs");
const axios = require("axios")
var ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");


exports.GetProgram = (req, res) => {

SentProgram.find({_id:req.params.id},"-Program.ExercisePlan").populate("Program.createdBy").then((result) => {
      if (result.length < 1) {
        return res.status(404).send([]);
      } else {
        return res.status(200).send(result);
      }
    })
    .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};

exports.DeleteProgram=(req, res)=>{
  SentProgram.deleteOne({_id:req.params.id}).then((result)=>{
    return res.status(200).send({message:"program deleted successfully"});
  })  .catch((error) => {
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
}


exports.SharedProgramId=(req,res) => {
  Program.findById(req.params.id).then((program) => {
    if(!program)
    return res.status(404).send()
    else{
      console.log(program)

if(program.PaymentType=="Subscription")
     {axios.post(
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
              "value":  program.Price,
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
      ).then(resSub=>{

        const sentitem = new SentProgram({   Program: program,
          Amount: program.Price,
          SendTo: [req.userData.figgsId],
          SenderId: program.createdBy,
          Title: program.Title,
          SubscriptionId:resSub?resSub.data.id:""})
          
          
          
          sentitem.save().then(result =>{
            res.status(200).send(result._id)
          })
        

      }).catch(err =>{return res.status(500).send})
    
    
    
    }


    else
    {
      const sentitem = new SentProgram({   Program: program,
        Amount: program.Price,
        SendTo: [req.userData.figgsId],
        SenderId: program.createdBy,
        Title: program.Title,
      })
      
      sentitem.save().then(result =>{
          res.status(200).send(result._id)
        })
    }
    


}









    }
  ).catch((error=>{
    res.status(500).send()
  }))
}




exports.AddProgram=(req,res) => {

console.log("adding progrma")

    SentProgram.findOne({_id:req.params.id
          }) .then((program) => {
              if(program){
                  console.log(program)
                const order = new Order({UserId:req.userData._id,Program:program.Program,ActualAmount:program.Amount,AmountPaid:program.Amount});
                order
                  .save()
                  .then(result => {
                    return res
                      .status(201)
                      .send({ message: "Order Created" });
                  })
              }
              else{
                  res.status(500).send()
              }
          })
          .catch((error) => {

          })


}