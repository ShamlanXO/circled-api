const SendOtp = require("../components/sendOtp");
const User = require("../models/user");
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
exports.SendOTP = (req, res) => {
  User.findOne({phone: req.query.phone}).then((userData) => {
    if(!userData){

    sendOTPReg.send(req.query.phone, "FIGGSS", function(error, data) {
      if (error) {
        return res.status(500).send({
          ErrorOccured: error
        });
      } else {
        return res.status(200).send({
          message: "OTP SENT",
          data
        });
      }

    });

  }
  else{
    return res.status(406).send({ message:"already exist"})
  }

}).catch((err)=>res.status(500).send({ message:"server error"}))
  
};

exports.SendOTPPasswordReset = (req, res) => {
  User.findOne({phone: req.query.phone}).then((userData) => {
    if(userData){

    sendOTPReg.send(req.query.phone, "FIGGSS", function(error, data) {
      if (error) {
        return res.status(500).send({
          ErrorOccured: error
        });
      } else {
        return res.status(200).send({
          message: "OTP SENT",
          data
        });
      }

    });

  }
  else{
    return res.status(404).send({ message:"not found"})
  }

}).catch((err)=>res.status(500))
  
};


exports.SendOTPUpdate = (req, res) => {
  User.findOne({phone: req.query.phone,_id:{$ne:req.userData._id}}).then((userData) => {
    if(!userData){

    sendOTPReg.send(req.query.phone, "FIGGSS", function(error, data) {
      if (error) {
        return res.status(500).send({
          ErrorOccured: error
        });
      } else {
        return res.status(200).send({
          message: "OTP SENT",
          data
        });
      }

    });

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
