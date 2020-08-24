
const aqp = require("api-query-params");
const SentProgram = require("../models/SentPrograms");
const Order = require("../models/Orders");
var ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");



exports.GetProgram = (req, res) => {
console.log("gerring")

console.log(req.userData,req.params._id)
SentProgram.find({_id:req.params.id,$or:[

{SendTo:req.userData.figgsId},
{SendTo:req.userData.email}

  ]})
  
  
   
    .then((result) => {
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