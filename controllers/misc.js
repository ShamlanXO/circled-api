const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const fs = require("fs");
const nodemailer = require("nodemailer");
const http = require("http");
var handlebars = require("handlebars");
const User = require("../models/user");
const Verify = require("../models/Verify");
require("dotenv").config();
var smtpTransport = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: "figgs@vilabs.tech",
    pass: "Figg@123",
  },
});
var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

//configuring the AWS environment
AWS.config.setPromisesDependency();
AWS.config.update({
  accessKeyId: "AKIA4XYECDTU3SEPOCU3",
  secretAccessKey: "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",
  region: "us-east-1",
});

var s3 = new AWS.S3();

exports.generatePasswordHash = (req, res) => {
  bcrypt.hash(req.query.Password, 10, function (err, hash) {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error Generating Hash", ErrorOccured: err });
    } else {
      return res.status(200).send({ hash });
    }
  });
};

exports.generateToken = (req, res) => {
  jwt.sign(
    { keyFor: "temporaryAuth" },
    "s3cr3t",
    { expiresIn: "2m" },
    function (err, token) {
      if (err) {
        return res.status(500).send({ ErrorOccured: err });
      } else {
        return res.status(200).send(token);
      }
    }
  );
};

exports.uploadSingleFile = (req, res) => {
  var params = {
    ACL: 'public-read',
    Bucket: "slorge",
    Body: fs.createReadStream(req.file.path),
    Key: `${Date.now()}${req.file.originalname}`,
  };
  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send({ ErrorOccured: err });
    }
    if (data) {
      fs.unlinkSync(req.file.path); // Empty temp folder
      const locationUrl = data.Location;
      return res.status(200).send({
        message: "File uploaded Successfully",
        Location: locationUrl,
        Key: params.Key,
      });
    }
  });
};

exports.uploadMultipleFile = (req, res) => {
  console.log(req.files);
  const file = req.files;
  var ResponseData = [];

  file.map((item) => {
    var params = {
      ACL: 'public-read',
      Bucket: "dailymains-answer-edizvik",
      Body: fs.createReadStream(item.path),
      Key: `${Date.now()}${item.originalname}`,
    };

    s3.upload(params, function (err, data) {
      if (err) {
        res.json({ error: true, Message: err });
      } else {
        fs.unlinkSync(item.path);
        ResponseData.push({ Location: data.Location, Key: params.Key });
        if (ResponseData.length == file.length) {
          res.json({
            error: false,
            Message: "File Uploaded  SuceesFully",
            Data: ResponseData,
          });
        }
      }
    });
  });
};

exports.uploadString = (req, res) => {
  const params = {
    Bucket: "dailymains-answer-edizvik",
    Body: req.body.Data,
    Key: `${Date.now()}.${req.body.Type}`,
    ContentEncoding: "base64",
    ContentType: `image/${req.body.Type}`,
  };
  s3.upload(params, function (err, data) {
    if (err) {
      return res.status(500).send({ Message: err });
    } else {
      return res.status(200).send({ Key: params.Key, Location: data.Location });
    }
  });
};

exports.downloadFile = (req, res) => {
  const imageStream = s3
    .getObject({
      Bucket: "dailymains-answer-edizvik",
      Key: req.query.key,
    })
    .createReadStream();
  res.attachment(req.query.key);
  imageStream.pipe(res);
};

exports.SendMail = (req, res) => {
  smtpTransport
    .sendMail({
      from: "figgs@vilabs.tech",
      to: req.body.Email,
      subject: req.body.Subject,
      html: req.body.MailBody,
    })
    .then((result) => {
      return res
        .status(200)
        .send({ message: "mail sent", ServerResponse: result });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.SendVerifyMail = (req, res) => {
  User.findOne({email: req.body.email}).then((userData) => {
    if(!userData){
      readHTMLFile(appRoot + "/templates/mail.html", function (err, html) {
        if(err){ 
          return res.status(500).send({ ErrorOccured: err })
      
      }
      else{
const token=Math.floor(100000 + Math.random() * 900000)
        Verify.updateOne({ email:req.body.email},{token:token},{upsert: true}).then(resultUpdate=>{
          console.log(resultUpdate)
          if(resultUpdate.nModified>0){
            var template = handlebars.compile(html);
            var replacements = {
             token:token,
              email: req.body.email,
              
            };
            var htmlToSend = template(replacements);
           
              smtpTransport
                .sendMail({
                  from: `figgs@vilabs.tech`,
                  to: req.body.email,
                  subject: "Email verification",
                  html: htmlToSend,
                })
                .then((result) => {
                  return res.status(200).send({ message: "mail sent", ServerResponse: result });
                }).catch(err => console.log(err));
          }
        }).catch(err => console.log(err));

       
       
      }

     
     
          
                
              
            
          
      
      })
    }
    else{
      res.status(406).send({ message:"user alreaddy exists"})
    }
  }).catch(err => res.status(500));
      
  
   
};

exports.ChangePasswordMail = (req, res) => {
  User.findOne({email: req.body.email,_id:{$not:req.userData._id}}).then((userData) => {
    if(!userData){
      readHTMLFile(appRoot + "/templates/mail.html", function (err, html) {
        if(err){ 
          return res.status(500).send({ ErrorOccured: err })
      
      }
      else{
const token=Math.floor(100000 + Math.random() * 900000)
        Verify.updateOne({ email:req.body.email},{token:token},{upsert: true}).then(resultUpdate=>{
          console.log(resultUpdate)
          if(resultUpdate.nModified>0){
            var template = handlebars.compile(html);
            var replacements = {
             token:token,
              email: req.body.email,
              
            };
            var htmlToSend = template(replacements);
           
              smtpTransport
                .sendMail({
                  from: `figgs@vilabs.tech`,
                  to: req.body.email,
                  subject: "Email verification",
                  html: htmlToSend,
                })
                .then((result) => {
                  return res.status(200).send({ message: "mail sent", ServerResponse: result });
                }).catch(err => console.log(err));
          }
        }).catch(err => console.log(err));

       
       
      }

     
     
          
                
              
            
          
      
      })
    }
    else{
      res.status(406).send({ message:"user alreaddy exists"})
    }
  }).catch(err => res.status(500));
      
};

exports.VerifyMail = (req, res) => {
  console.log(req.body);
  Verify.findOne({ email: req.body.email,token:req.body.token }).then((response) => {
   

    if (!response) return res.status(404).send({ error: "no user found" });

    jwt.sign(
      { uuid: req.body.email, type:"email"},
      "s3cr3t",
      { expiresIn: "1d" },
      function (err, token) {
        if (err) {
          return res.status(500).send({ ErrorOccured: err });
        } else {
          return res.status(200).send(token);
        }
      }
    )
  
 
  }).catch(err => {return res.status(500)})
};
