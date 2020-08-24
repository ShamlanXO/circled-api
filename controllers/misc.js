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
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type:"OAuth2",
    user: "infos@figgs.co",
    serviceClient:"112776113917962319629",
    privateKey:"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCW0tHV9o8QTFH3\nTgzO/1y8S18rGvedpfXW8V6CgqGpPiw1d3ZzlwI+XxwTpwdmxjcRp3UfxqiJK0K6\n1xnrX1wmkrBbgs1DFnWc+ia5n6cin5HSixA02rLTUCewoxS2uAGPwOi+N7mZEqbc\nfkZohS3zK/oMxVS4rGUAch+CoBbup0Nz3C6fQFn9/uBH23sXjq/cNUYhYDwCus2A\nwinKrekzrFtP9PIXTdDhm3irMloqnrHlDQurTaXwURWijm2ETXz4CvlA3ZJFg+aT\nYen0e1uaaLBfGKtLdlPT3HHSDagh81tgNaQSAs6ShPskUgQSEJSRbCmi7fOJ3Oh1\nWl6rlNVHAgMBAAECggEARr+ButI7bbO/RziPfZH/2Duq2rd9q6+r0DXM1X+dgZwu\ndK4jHDmbzdIjg3x4VldogZmBsXQonp9yX96CxAwpV9a7b1G+I1gnt4kIHU6swesE\nJjUhVwm3lLQmyg7VqphJ8zrUclYFc65yI0AAmwrN8SGR2+e8xBvqDPl7mnSqDSwk\nbcU563WigaHYHiWRBzDE2PpVVu0NOt8h39AgkLoPBHa13l5rCsc7rBwdIpDqvN7J\n04KZp3dANTmT8I+J6TEmUmafKtAIYhU+sy323ODpBO1X6RU4Ep4We+j1yl6TCarO\nPJRVVLYeiQciSImky1eIJeJunrHyp0Gs+uhkCyeCMQKBgQDI17B5KsUVcH6WblWl\nsMGbt4afFhkDEe1MM0jfYRw8O9gnPP7aKCGoUSsPU2k3ZDKqDCuC3zv2HYPh1Uau\nZGeJro4ncGQEVYf4wNC/JC4chzju16wKw+wYcUCxNpU1gk4bsI/QAjjM92OD+xay\n5RGgwAbNMkCWFib/WvkPBIsa6wKBgQDAPoYliSMZDoF9XOXjayZQgI59VIF+/blL\n8xrr+Q+jOIBk3QwqekmInhkHxhbvmMq9iACE5j4oXdIKB9e5DmKhu4gIJZZS6X3p\np8JD2vq000d/p+zK1XdWGXLiVrd5ZmvOsFevYRXf+HMyLguoI3u75W1AUUuB2WbU\n9m2C2lrgFQKBgCFHM9Nv1cYOpLryPzi8B+hwSVsUw0Ix9zq4CKwSoCYO2Grv/V5S\nZflIsbTRYk6uSILKj28Y5AuMqmyB9TsyIcG7bYx1X+0j6uq5sBzrtsQ9V56jl7sU\n6YrHQSvb2m9KTvzhjYKuy5CSsSeONB2iPQCAsN/RIsh7lSyce0YUv6PPAoGAY0qn\nzJFFEHb+iHpHviskceXEMpVIAQgZAVJBsGlGG15eajoFQ5c/jZFiijJUvFFlPXkW\nE447wmuaxVWBpPH6HWCXhOWs+4vfXaQo4RUj8etB/XwFAEo6xbyFKsPxJYGx4uIP\nl+SEANb44I0JtkEFcmmwAM08O4fG5e2VaEVRNHUCgYA9YGo/ywj3YdVQ6HlMSIAb\ncHIxXrrrCP0pZXzF7az+mp9jZClXQ7NLTH+tdMPr45zZ2j6shVKUpAY5SQH6+Bvg\nVH12ithK1BQZ6FA0flbyzA2UTq76GYdbf4fu0CwdgqGKJEs0FBfj79F9StsCyalf\nOe7ZzYw7i0IC355dCIO0Aw==\n-----END PRIVATE KEY-----\n",
    
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
    Key: `${Date.now()}${"-"}${req.file.originalname}`,
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err)
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
      to: req.body.Email.toLowerCase(),
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
  User.findOne({email: req.body.email.toLowerCase()}).then((userData) => {
    if(!userData){
      readHTMLFile(appRoot + "/templates/mail.html", function (err, html) {
        if(err){ 
          return res.status(500).send({ ErrorOccured: err })
      
      }
      else{
const token=Math.floor(100000 + Math.random() * 900000)
        Verify.updateOne({ email:req.body.email.toLowerCase()},{token:token},{upsert: true}).then(resultUpdate=>{
          console.log(resultUpdate)
          if(resultUpdate.nModified>0){
            var template = handlebars.compile(html);
            var replacements = {
             token:token,
              email: req.body.email.toLowerCase(),
              
            };
            var htmlToSend = template(replacements);
            smtpTransport.verify().then(result=>{

              smtpTransport
              .sendMail({
                from: `Figgs <infos@figgs.co>`,
                to: req.body.email.toLowerCase(),
                subject: "Email verification",
                html: htmlToSend,
              })
              .then((result) => {
                return res.status(200).send({ message: "mail sent", ServerResponse: result });
              }).catch(err =>res.status(500));
              
            })
             
          }
        }).catch(err => res.status(500));

       
       
      }

     
     
          
                
              
            
          
      
      })
    }
    else{
      res.status(406).send({ message:"user alreaddy exists"})
    }
  }).catch(err => res.status(500));
      
  
   
};

exports.ChangePasswordMail = (req, res) => {
  User.findOne({email: req.body.email.toLowerCase(),_id:{$ne:req.userData._id}}).then((userData) => {
    if(!userData){
      readHTMLFile(appRoot + "/templates/mail.html", function (err, html) {
        if(err){ 
          return res.status(500).send({ ErrorOccured: err })
      
      }
      else{
const token=Math.floor(100000 + Math.random() * 900000)
        Verify.updateOne({ email:req.body.email.toLowerCase()},{token:token},{upsert: true}).then(resultUpdate=>{
          console.log(resultUpdate)
          if(resultUpdate.nModified>0){
            var template = handlebars.compile(html);
            var replacements = {
             token:token,
              email: req.body.email.toLowerCase(),
              
            };
            var htmlToSend = template(replacements);
           
              smtpTransport
                .sendMail({
                  from: `figgs@vilabs.tech`,
                  to: req.body.email.toLowerCase(),
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
  }).catch(err =>{ 
    console.log(err)
    res.status(500)});
      
};


exports.ChangePasswordMail2 = (req, res) => {
  User.findOne({email: req.body.email.toLowerCase()}).then((userData) => {
    if(userData){
      readHTMLFile(appRoot + "/templates/mail.html", function (err, html) {
        if(err){ 
          return res.status(500).send({ ErrorOccured: err })
      
      }
      else{
const token=Math.floor(100000 + Math.random() * 900000)
        Verify.updateOne({ email:req.body.email.toLowerCase()},{token:token},{upsert: true}).then(resultUpdate=>{
          console.log(resultUpdate)
          if(resultUpdate.nModified>0){
            var template = handlebars.compile(html);
            var replacements = {
             token:token,
              email: req.body.email.toLowerCase(),
              
            };
            var htmlToSend = template(replacements);
           
              smtpTransport
                .sendMail({
                  from: `figgs@vilabs.tech`,
                  to: req.body.email.toLowerCase(),
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
      res.status(404).send({ message:"user alreaddy exists"})
    }
  }).catch(err =>{ 
    console.log(err)
    res.status(500)});
      
};






exports.VerifyMail = (req, res) => {
  console.log(req.body);
  Verify.findOne({ email: req.body.email.toLowerCase(),token:req.body.token }).then((response) => {
   

    if (!response) return res.status(404).send({ error: "no user found" });

    jwt.sign(
      { uuid: req.body.email.toLowerCase(), type:"email"},
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
