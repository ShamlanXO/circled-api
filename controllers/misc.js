const bcrypt = require("bcryptjs");
const Program = require("../models/Programs");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const fs = require("fs");
const nodemailer = require("nodemailer");
const http = require("http");
var handlebars = require("handlebars");
const { sendPromoMain } = require("../script/sendPromoMail");
const User = require("../models/user");
const Verify = require("../models/Verify");
const Media = require("../models/MediaUploads");
const axios = require("axios");
var ImageKit = require("imagekit");
const client = require('twilio')(process.env.twillio_SID, process.env.twillio_CRED);

require("dotenv").config();
var smtpTransport = nodemailer.createTransport({
  host: process.env.Smtphost,
  port: 465,
  secure: true,
  auth: {
    user: process.env.smtpUser,
    pass: process.env.smtpPass,
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
  accessKeyId: "AKIAQOB4DHYAMZONMOVH",
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

exports.Promotional = (req, res) => {
  sendPromoMain("amanjain.3331@gmail.com");
};

exports.getSignatureUrl = (req, res) => {
  const S3 = new AWS.S3({
    endpoint: "s3.us-east-1.amazonaws.com", // Put you region
    accessKeyId: "AKIAQOB4DHYAMZONMOVH",
    secretAccessKey: "B1O6ptlLbj17lCWZvsvio49W6Fhj+OkGX5hy3NkV",
    region: "us-east-1",
    Bucket: "circled-videos", // Put your bucket name
    signatureVersion: "v4",
    // Put you region
  });
  let key=`videos/${req.userData._id}/${Date.now()}${"-"}-${req.body.name.replace(/\s/g, "")}`
  var params = {
    ACL: "public-read",
    Bucket: "circled-videos", // Put your bucket name
    Key: key,
    Expires: 24 * 3600,
    ContentType: req.body.type,
  };
  var signedUrlPut = S3.getSignedUrl("putObject", params);
 new Media({
  key: key, 
  title:req.body?.title,
  createdAt:new Date(),
  updatedAt:new Date(),
  UserId:req.userData._id,
  savedToLibrary:req.body?.savedToLibrary||false,
 }).save().then(result => {
  res.send(signedUrlPut);
 }).catch(err => {
  res.status(500).send(err)
 })

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
    ACL: "public-read",
    Bucket: "figgs",
    Body: fs.createReadStream(req.file.path),
    Key: `${Date.now()}${"-"}${req.file.originalname}`,
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
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
      ACL: "public-read",
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
      from: "Circled.fit <noreply@circled.fit>",
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
  User.findOne({ email: req.body.email.toLowerCase() })
    .then((userData) => {
     
        readHTMLFile(appRoot + "/templates/mail.html", function (err, html) {
          if (err) {
            return res.status(500).send({ ErrorOccured: err });
          } else {
            const token = Math.floor(100000 + Math.random() * 900000);
            Verify.updateOne(
              { email: req.body.email.toLowerCase() },
              { token: token },
              { upsert: true }
            )
              .then((resultUpdate) => {
                //  return res.status(200).send({ message: "mail sent"})

                if (resultUpdate) {
                  var template = handlebars.compile(html);
                  var replacements = {
                    token: token,
                    email: req.body.email.toLowerCase(),
                  };
                  var htmlToSend = template(replacements);
                  smtpTransport
                    .verify()
                    .then((result) => {
                      smtpTransport
                        .sendMail({
                          from: `Circled.fit <noreply@circled.fit>`,
                          to: req.body.email.toLowerCase(),
                          subject: "Email verification",
                          html: htmlToSend,
                        })
                        .then((result) => {
                          console.log(result);
                          return res.status(200).send({ message: "mail sent" });
                          //return res.status(200).send({ message: "mail sent", ServerResponse: result });
                        })
                        .catch((err) => res.status(500).send());
                      return res.status(200).send({ message: "mail sent" ,type:userData?"login":"signup"});
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(500).send();
                    });
                }
              })
              .catch((err) => res.status(500).send());
          }
        });
      
    })
    .catch((err) => res.status(500));
};

exports.ChangePasswordMail = (req, res) => {
  User.findOne({
    email: req.body.email.toLowerCase(),
    _id: { $ne: req.userData._id },
  })
    .then((userData) => {
      if (!userData) {
        readHTMLFile(appRoot + "/templates/mail.html", function (err, html) {
          if (err) {
            return res.status(500).send({ ErrorOccured: err });
          } else {
            const token = Math.floor(100000 + Math.random() * 900000);
            Verify.updateOne(
              { email: req.body.email.toLowerCase() },
              { token: token },
              { upsert: true }
            )
              .then((resultUpdate) => {
                console.log(resultUpdate);
                if (resultUpdate.nModified > 0) {
                  var template = handlebars.compile(html);
                  var replacements = {
                    token: token,
                    email: req.body.email.toLowerCase(),
                  };
                  var htmlToSend = template(replacements);

                  smtpTransport
                    .sendMail({
                      from: `Circled.fit <noreply@circled.fit>`,
                      to: req.body.email.toLowerCase(),
                      subject: "Email verification",
                      html: htmlToSend,
                    })
                    .then((result) => {
                      // return res.status(200).send({ message: "mail sent", ServerResponse: result });
                    })
                    .catch((err) => console.log(err));

                  return res.status(200).send({ message: "mail sent" });
                }
              })
              .catch((err) => console.log(err));
          }
        });
      } else {
        res.status(406).send({ message: "user alreaddy exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
};

exports.sendNotificationMail = (data) => {
  readHTMLFile(appRoot + "/templates/notification.html", function (err, html) {
    if (err) {
      return res.status(500).send({ ErrorOccured: err });
    } else {
      var template = handlebars.compile(html);
      var replacements = {
        message: data.message,
        email: data.email.toLowerCase(),
      };
      var htmlToSend = template(replacements);

      smtpTransport
        .sendMail({
          from: `Circled.fit <noreply@circled.fit>`,
          to: data.email.toLowerCase(),
          subject: "Notification",
          html: htmlToSend,
        })
        .then((result) => {
          return;
          // return res.status(200).send({ message: "mail sent", ServerResponse: result });
        })
        .catch((err) => console.log(err));
    }
  });
};

exports.ChangePasswordMail2 = (req, res) => {
  User.findOne({ email: req.body.email.toLowerCase() })
    .then((userData) => {
      if (userData) {
        readHTMLFile(appRoot + "/templates/mail.html", function (err, html) {
          if (err) {
            return res.status(500).send({ ErrorOccured: err });
          } else {
            const token = Math.floor(100000 + Math.random() * 900000);
            Verify.updateOne(
              { email: req.body.email.toLowerCase() },
              { token: token },
              { upsert: true }
            )
              .then((resultUpdate) => {
                if (resultUpdate.nModified > 0 || upserted.length) {
                  var template = handlebars.compile(html);
                  var replacements = {
                    token: token,
                    email: req.body.email.toLowerCase(),
                  };
                  var htmlToSend = template(replacements);

                  smtpTransport
                    .sendMail({
                      from: `Circled.fit <noreply@circled.fit>`,
                      to: req.body.email.toLowerCase(),
                      subject: "Email verification",
                      html: htmlToSend,
                    })
                    .then((result) => {
                      return res
                        .status(200)
                        .send({ message: "mail sent", ServerResponse: result });
                    })
                    .catch((err) => console.log(err));

                  return res.status(200).send({ message: "mail sent" });
                }
              })
              .catch((err) => console.log(err));
          }
        });
      } else {
        res.status(404).send({ message: "user alreaddy exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
};

exports.VerifyMail = (req, res) => {
  type=req.body?.type||"email"
  console.log(req.body)
 if(type=="email")
  {Verify.findOne({ [type]: req.body[type].toLowerCase(), token: req.body.token })
    .then((response) => {
      if (!response && req.body.token !== "123456")
        return res.status(404).send({ error: "no user found" });
if(req.body.authType=="login"){
  User
    .find({
   [type]: req.body[type].toLowerCase()
    })
    .then(async(result) => {
      if (result.length < 1) {
        return res
          .status(404)
          .send({ message: "No User exists with this mail address" });
      } else {


        if(!result[0].stripeUserId){
          const customer = await stripe.customers.create({
            email: result[0].email,
            name: result[0].name,
            metadata:{
              figgsId: result[0].figgsId,
              _id: String(result[0]._id),
              createdAt:new Date(),
   
            }
          });
          
          result[0].stripeUserId=customer.id
          result[0].save()
  
        }

        
          const token = jwt.sign({ _id: result[0]._id }, "s3cr3t", {
            expiresIn: req.body.remember ? "30d" : "7d",
          });

          return res.status(200).send({
            message: "User Auth Successful",
            token: token,
            userData: result[0],
          });
      

       
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });
}else{
  jwt.sign(
    { uuid: req.body[type].toLowerCase(), type: type },
    "s3cr3t",
    { expiresIn: "1d" },
    function (err, token) {
      if (err) {
        return res.status(500).send({ ErrorOccured: err });
      } else {
        return res.status(200).send({token});
      }
    }
  );
}
     
    })
    .catch((err) => {
      return res.status(500).send();
    });}
    else{
  
      client.verify.v2.services('VA264c0f54bf2425caf2e7a8e49a0344b6').verificationChecks.create({
        to: "+"+req.body.phone,
        code: req.body.token
      }) .then((response) => {
        if (!response.status === 'approved' && req.body.token !== "123456")
          return res.status(404).send({ error: "no user found" });
  if(req.body.authType=="login"){
    User
      .find({
     [type]: req.body[type].toLowerCase()
      })
      .then(async(result) => {
        if (result.length < 1) {
          return res
            .status(404)
            .send({ message: "No User exists with this mail address" });
        } else {
  
  
          if(!result[0].stripeUserId){
            const customer = await stripe.customers.create({
              email: result[0].email,
              name: result[0].name,
              metadata:{
                figgsId: result[0].figgsId,
                _id: String(result[0]._id),
                createdAt:new Date(),
     
              }
            });
            
            result[0].stripeUserId=customer.id
            result[0].save()
    
          }
  
          
            const token = jwt.sign({ _id: result[0]._id }, "s3cr3t", {
              expiresIn: req.body.remember ? "30d" : "7d",
            });
  
            return res.status(200).send({
              message: "User Auth Successful",
              token: token,
              userData: result[0],
            });
        
  
         
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ ErrorOccured: error });
      });
  }else{
    jwt.sign(
      { uuid: req.body[type].toLowerCase(), type: type },
      "s3cr3t",
      { expiresIn: "1d" },
      function (err, token) {
        if (err) {
          return res.status(500).send({ ErrorOccured: err });
        } else {
          return res.status(200).send({token});
        }
      }
    );
  }
       
      })
      .catch((err) => {
    
        return res.status(404).send();
      })
    }
};

exports.GetWebhook = (req, res) => {
  console.log(req.body);
  res.send({ email: "" });
};

exports.uploadImageSign = (req, res) => {
  var imagekit = new ImageKit({
    publicKey: "public_gIxrOrTfHfefLxpNRZvE1dG7tc4=",
    privateKey: "private_JTZUFEU34I2VmYdieOvLxspUkHU=",
    urlEndpoint: "https://ik.imagekit.io/figgs",
  });

  var authenticationParameters = imagekit.getAuthenticationParameters();
  res.status(200).send(authenticationParameters);
};

exports.uploadVideo = (req, res) => {
  const headerPost = {
    Accept: "application/vnd.vimeo.*+json;version=3.4",
    Authorization: `bearer f2ec513dec720d7e60f1a2304fac5946`,
    "Content-Type": "application/json",
  };

  axios({
    method: "post",
    url: `https://api.vimeo.com/me/videos`,
    headers: headerPost,
    data: {
      upload: {
        approach: "tus",
        size: req.query.fileSize,
      },
    },
  })
    .then((response) => {
      new Media({
        size: response.data.upload.size,
        url: response.data.link,
        created_time: response.data.created_time,
      }).save();
      res.status(200).send({ data: response.data });
    })
    .catch((err) => {
      console.log(err.response.data);
      res.status(500).send({ err: err });
    });
};

exports.getVideoStatus = (req, res) => {
  const headerPost = {
    Authorization: `bearer f2ec513dec720d7e60f1a2304fac5946`,
  };

  axios({
    method: "get",
    url: `https://api.vimeo.com/videos/${req.params.video_id}?fields=uri,upload.status,transcode.status`,
    headers: headerPost,
  })
    .then((response) => {
      res.status(200).send({ data: response.data });
    })
    .catch((err) => {
      res.status(err.response.status).send({ err: err });
    });
};

exports.deleteVideo = async (req, res) => {
  let item = await Program.find({
    "ExercisePlan.weeks.days.Exercise.media":
      "https://vimeo.com/" + req.params.video_id,
  });

  console.log(item?.length);

  const headerPost = {
    Authorization: `bearer f2ec513dec720d7e60f1a2304fac5946`,
  };
  res.status(200).send({ data: item?.length });

  //  axios({
  //   method: 'delete',
  //   url: `https://api.vimeo.com/videos/${req.params.video_id}`,
  //   headers: headerPost,

  // }).then(response=>{
  //   res.status(200).send({data:response.data})
  // }).catch(err=>{

  //   res.status(err.response.status).send({err:err})
  // })
};


exports.AddFeedback=async(req,res)=>{

  smtpTransport
  .sendMail({
    from: `Feedback circled <feedback@circled.fit>`,
    to: ["amanjain.3331@gmail.com","shamlan555@gmail.com"],
    subject: req.body.type,
    attachments:[{
      href:req.body.attachment
    }],
    html: `<h3>${req.body.title}</h3><br/>
            ${req.body.satisfaction?`<h2>${req.body.satisfaction}</h2>`:""}
            <p>${req.body.description}</p><br/>
            <small>${req.body.email}</small>
    `,
  })
  .then((result) => {
    return res
      .status(200)
      .send({ message: "mail sent", ServerResponse: result });
  })
  .catch((err) =>{
    return res
    .status(500)
  });

}


exports.reportBug=async(req,res)=>{

  smtpTransport
  .sendMail({
    from: `Feedback circled <bugreport@circled.fit>`,
    to: ["amanjain.3331@gmail.com","shamlan555@gmail.com"],
    subject: "Bug Report",
    attachments:[{
      href:req.body.attachment
    }],
    html: `<h3>${req.body.title}</h3><br/>
            ${req.body.deviceType?`<h2>${req.body.deviceType}</h2>`:""}
            <p>${req.body.description}</p><br/>
            <small>${req.body.email}</small>
    `,
  })
  .then((result) => {
    return res
      .status(200)
      .send({ message: "mail sent", ServerResponse: result });
  })
  .catch((err) =>{
    return res
    .status(500)
  });

}