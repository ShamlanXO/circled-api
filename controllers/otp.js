const SendOtp = require("../components/sendOtp");
const User = require("../models/user");

const Verify = require("../models/Verify");

const client = require('twilio')(process.env.twillio_SID, process.env.twillio_CRED);


const sendOtp = new SendOtp(
  "295956Ayx1TlMrGo5d8c4054",
  "{{otp}} is your Secret OTP for completing password reset process. Do not Share it with Anyone."
);

const sendOTPReg = new SendOtp(
  "295956Ayx1TlMrGo5d8c4054",
  "{{otp}} is your Secret OTP to complete the registration process. Do not Share it with Anyone."
);
const user = require("../models/user");
const jwt = require("jsonwebtoken");
console.log(process.env.twillio_SID, process.env.twillio_CRED)
exports.SendOTP = (req, res) => {
  User.findOne({phone: req.query.phone}).then((userData) => {
    if(!userData){


      const token=Math.floor(100000 + Math.random() * 900000)
        Verify.updateOne({ mobile:req.query.phone.toLowerCase()},{token:token},{upsert: true}).then(resultUpdate=>{

          if(resultUpdate.nModified>0){

            client.messages
            .create({body: 'You secret verification code for circled.fit is '+token, from: `${req.params?.channel=="whatsapp"?"whatsapp:":""}+${req.params.phone}`, to:`${req.params?.channel=="whatsapp"?"whatsapp:":""}${req.params.phone}`})
            .then(message => {

              return res.status(200).send({
                message: "OTP SENT",
              
              });
            }).catch((err)=>{
              console.log(err)
              res.status(500).send({})})

          }
         
        }).catch((err)=>{
          console.log(err)
          res.status(500).send({ message:"server error"})})

 

  }
  else{
    return res.status(406).send({ message:"already exist"})
  }

}).catch((err)=>{
  console.log(err)
  res.status(500).send({ message:"server error"})})
  
};

exports.SendOTPPasswordReset = (req, res) => {
  User.findOne({phone: req.query.phone}).then((userData) => {
    if(userData){

      const token=Math.floor(100000 + Math.random() * 900000)
      Verify.updateOne({ mobile:req.query.phone.toLowerCase()},{token:token},{upsert: true}).then(resultUpdate=>{

        if(resultUpdate.nModified>0){

          client.messages
          .create({body: 'You secret verification code for fiigs is '+token, from: '+18564315487', to: req.query.phone})
          .then(message => {

            return res.status(200).send({
              message: "OTP SENT",
           
            });
          });

        }
        else{
          return res.status(500).send({
            ErrorOccured: error
          });
        }
      }).catch((err)=>res.status(500).send({ message:"server error"}))


  }
  else{
    return res.status(404).send({ message:"not found"})
  }

}).catch((err)=>res.status(500))
  
};


exports.SendOTPUpdate = (req, res) => {
  User.findOne({phone: req.query.phone,_id:{$ne:req.userData._id}}).then((userData) => {
    if(!userData){

      const token=Math.floor(100000 + Math.random() * 900000)
      Verify.updateOne({ mobile:req.query.phone.toLowerCase()},{token:token},{upsert: true}).then(resultUpdate=>{

        if(resultUpdate.nModified>0){

          client.messages
          .create({body: 'You secret verification code for fiigs is '+token, from: '+18564315487', to: req.query.phone})
          .then(message => {
console.log(message)
            return res.status(200).send({
              message: "OTP SENT",
       
            });
          }).catch((err)=>{
            
            res.status(500)})

        }
        else{
          return res.status(500).send({
            ErrorOccured: error
          });
        }
      }).catch((err)=>res.status(500).send({ message:"server error"}))

  }
  else{
    return res.status(406).send({
      message: "already exists"
    })
  }

}).catch((err)=>res.status(500).send({ ErrorOccured: err}))
  
};



exports.VerifyOTP = (req, res) => {
 console.log(req.query.phone,req.query.otp)
        sendOtp.verify(req.query.phone, req.query.otp, function(error, data) {
          if (error) {
            return res.status(500).send({
              ErrorOccured: error
            });
          }
          if (data.type == "success") {
            const authToken = jwt.sign(
              { uuid: req.query.phone, type:"phone"},
              "s3cr3t",
              { expiresIn: "1d" }
            );

         

            return res.status(200).send({
              message: "OTP Verified Successfully",
              token: authToken
            });
          }

          if (data.type == "error") {
            return res.status(400).send({
              message: "OTP Verification Failed"
            });
          }
        });
      

 
};

exports.RetryOTP = (req, res) => {
  sendOtp.retry(req.query.phone, true, function(error, data) {
    if (error) {
      return res.status(500).send({
        ErrorOccured: error
      });
    } else {
      return res.status(200).send({
        message: "OTP Retry Successful"
      });
    }
  });
};
