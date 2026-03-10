const user = require("../models/user");
const Verify = require("../models/Verify");
const jwt = require("jsonwebtoken");
const axios =require("axios")
const bcrypt = require("bcryptjs");
const SendOtp = require("../components/sendOtp");
const aqp = require("api-query-params");
const _ =require("lodash");
const NotificationHandler = require("../utils/SendNotification")
const programs = require("../models/Programs");
// B-02 fix: Stripe key loaded from environment variable
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendOtp = new SendOtp(
  "295956Ayx1TlMrGo5d8c4054",
  "{{otp}} is your Secret OTP for completing the current process. Do not Share it with Anyone."
);
exports.FetchUser = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  user
    .find(filter)
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

exports.SearchUser = (req, res) => {
  user
    .aggregate([
      { $match: { $text: { $search: req.params.qry } } },
      { $sort: { score: { $meta: "textScore" } } },
      {
        $project: {
          name: "$name",
          profilePic: "$profilePic",
          category: "$category",
        },
      },
    ])
    .then(async (result) => {
      let ids = result.map((i) => i._id);
      console.log(ids);
      let items = await programs
        .find(
          {
            IsPublished: true,
            $or: [
              { Title: { $regex: `.*${req.params.qry}.*`, $options: "i" } },
              { createdBy: { $in: ids } },
            ],
          },
          { Title: 1, BannerImage: 1 }
        )
        .populate("createdBy", "name");
      console.log(items);

      if (result.length < 1 && items.length < 1)
        return res.status(404).send({ result, items });
      else return res.status(200).send({ result, items });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ error });
    });
};

exports.CreateUser = async (req, res) => {
 
  let userData = await user.findOne({}).sort({ createdAt: -1 });
  let figgsId = Number(userData?.figgsId || 1000);
  if (req.body.authType == "gmail") {
    let verifyToken=await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.tokenId}`)

    if(!verifyToken?.data?.email_verified||req.body.email!==verifyToken?.data?.email){
      return res.status(403).send()
    }
    let userData = await user.findOne({ email: req.body.email });
    if (userData) {
      const token = jwt.sign({ _id: userData._id }, process.env.jwtSecret, {
        expiresIn: "30d",
      });

      if(!userData.stripeUserId){
        const customer = await stripe.customers.create({
          email: userData.email,
          name: userData.name,
          metadata:{
            figgsId: userData.figgsId,
            _id: String(userData._id),
            createdAt:new Date(),
 
          }
        });
        
        userData.stripeUserId = customer.id;
        await userData.save();
      }
     

      return res
        .status(201)
        .send({ userData: userData, message: "User Created", token: token });
    }
    const User = new user({
      ...req.body,
      uuid: req.body.email,

      figgsId: Number(figgsId + 1),
    });
    User.save()
      .then(async(result) => {

        if(!result.stripeUserId){
          const customer = await stripe.customers.create({
            email: result.email,
            name: result.name,
            metadata:{
              figgsId: result.figgsId,
              _id: String(result._id),
              createdAt:new Date(),
   
            }
          });
          
          result.stripeUserId=customer.id;
          // B-12 fix: await the save to prevent race conditions
          await result.save();
  
        }

        const token = jwt.sign({ _id: result._id }, process.env.jwtSecret, {
          expiresIn: "30d",
        });

        return res
          .status(201)
          .send({ userData: result, message: "User Created", token: token });
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(500)
          .send({ message: "Error Creating User", ErrorOccured: error });
      });
  } else {
    const decoded = jwt.verify(req.body.token, process.env.jwtSecret);
   
     

     
if(decoded.type!=="phone"){
  delete req.body.email;
}
     
      delete req.body.phone;
      delete req.body.password;

     
      const User = new user({
        ...req.body,
        uuid: decoded.uuid,
        [decoded.type]: decoded.uuid.toLowerCase(),
      
        figgsId: Number(figgsId + 1),
      });
      User.save()
        .then(async(result) => {

        if(!result.stripeUserId){
          const customer = await stripe.customers.create({
            email: result.email,
            name: result.name,
            metadata:{
              figgsId: result.figgsId,
              _id: String(result._id),
              createdAt:new Date(),
   
            }
          });
          
          result.stripeUserId=customer.id;
          // B-12 fix: await the save to prevent race conditions
          await result.save();
  
        }
          const token = jwt.sign({ _id: result._id }, process.env.jwtSecret, {
            expiresIn: "30d",
          });

          return res.status(201).send({
            userData: result,
            message: "User Created",
            token: token,
          });
        })
        .catch((error) => {
          console.log(error);
          return res
            .status(500)
            .send({ message: "Error Creating User", ErrorOccured: error });
        });
   
  }
};

exports.UserLogin = async(req, res) => {

  let verifyToken=await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.tokenId}`)

  if(!verifyToken?.data?.email_verified||req.body.email!==verifyToken?.data?.email){
    return res.status(403).send()
  }


  user.find({
   email: req.body.email,
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
          
          result[0].stripeUserId=customer.id;
          // B-12 fix: await the save to prevent race conditions
          await result[0].save();
  
        }

        if (
          result[0].authType &&
          result[0].authType.includes(req.body.authType)
        ) {
          const token = jwt.sign({ _id: result[0]._id }, process.env.jwtSecret, {
            expiresIn: req.body.remember ? "30d" : "30d",
          });

          return res.status(200).send({
            message: "User Auth Successful",
            token: token,
            userData: result[0],
          });
        }

        if (req.body.authType) {
          return res.status(408).send({
            message: "Different mode",
          });
        }
        // bcrypt.compare(
        //   req.body.password,
        //   result[0].password,
        //   function (err, same) {
        //     if (err) {
        //       return res.status(500).send({
        //         message: "Error Comparing Passwords",
        //         ErrorOccured: err,
        //       });
        //     }
        //     if (same) {
        //       const token = jwt.sign({ _id: result[0]._id }, process.env.jwtSecret, {
        //         expiresIn: req.body.remember ? "30d" : "30d",
        //       });

        //       return res.status(200).send({
        //         message: "User Auth Successful",
        //         token: token,
        //         userData: result[0],
        //       });
        //     } else {
        //       return res.status(409).send({
        //         message: "Invalid password",
        //       });
        //     }
        //   }
        // );
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UserUpdate = (req, res) => {
  console.log(req.userData);
  delete req.body._id;

 
  delete req.body.password;
  user
    .updateOne({ _id: req.userData._id }, req.body, function (err, result) {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error Updating User", ErrorOccured: err });
      }
      return res.status(200).send({ message: "User Updated" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UserUpdateAuth =async (req, res) => {
  let verifyToken=await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.tokenId}`)

  if(!verifyToken?.data?.email_verified||req.body.email!==verifyToken?.data?.email){
    return res.status(403).send()
  }
  user
    .updateOne(
      { email: req.body.email },
      { $addToSet: { authType: req.body.authType } },
      function (err, result) {
        if (err) {
          return res
            .status(500)
            .send({ message: "Error Updating User", ErrorOccured: err });
        }
        return res.status(200).send({ message: "User Updated" });
      }
    )
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UserSensitiveDataUpdate = (req, res) => {
  console.log(req.userData);
  const decoded = jwt.verify(req.body.token, process.env.jwtSecret);
  user
    .updateOne(
      { _id: req.userData._id },
      { [decoded.type]: decoded.uuid },
      function (err, result) {
        if (err) {
          return res
            .status(500)
            .send({ message: "Error Updating User", ErrorOccured: err });
        }
        return res.status(200).send({ message: "User Updated" });
      }
    )
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteUser = (req, res) => {
  user
    .findByIdAndRemove(req.params.UserId)
    .then((result) => {
      return res.status(200).send({ message: "User Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CheckUserExistence = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  user
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then((result) => {
      if (result.length < 1) {
        return res
          .status(404)
          .send({ message: "No User exists with this data" });
      } else {
        return res.status(200).send({
          message: "User Exists with this data",
          id: result[0]._id,
          email: result[0].email,
          phone: result[0].phone,
          authType: result[0].authType,
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.ResetPassword=async(req,res)=>{

  const currentPassword=await bcrypt.hash(req.body.currentPassword,10)
  const newPassword=await bcrypt.hash(req.body.Password,10)


      user.findOne(
        { _id: req.userData._id },
       
        
      ).then(async (result)=>{
        
        let compare=await bcrypt.compareSync(
          req.body.currentPassword
          ,
          result.password)

          console.log(compare,result.password,currentPassword)
          if(!compare){
            return res.status(409).send();
          }

          result.password = newPassword;
          result.save();
          
           
              return res.status(200).send({ message: result });
         
          
        
      })
   
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });


}

exports.ChangePassword = (req, res) => {
  const decoded = jwt.verify(req.body.token, process.env.jwtSecret);

  bcrypt
    .hash(req.body.Password, 10)
    .then((hash) => {
      user.updateOne(
        { [decoded.type]: decoded.uuid },
        { password: hash },
        function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).send({ ErrorOccured: err });
          }
          if (result) {
            if (result.nModified > 0)
              return res.status(200).send({ message: result });
            else return res.status(500);
          }
        }
      );
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};



exports.ChangePasswordEmail = (req, res) => {
  console.log(req.body.Email);

  user.findOne({ email: req.body.Email.toLowerCase() }).then((userData) => {
    if (!userData) {
      console.log(":errin us data");
      return res.status(404).send({ message: "No  Data Found" });
    } else {
      jwt.verify(req.body.token, process.env.jwtSecret, function (err, decoded) {
        console.log(decoded);
        user
          .find({ email: decoded.Email })

          .then((result) => {
            console.log(result);
            if (result.length < 1) {
              console.log(":errin us data n o record");
              return res.status(404).send({ message: "No  Data Found" });
            } else {
              // B-10 fix: use lowercase camelCase to match the Mongoose model (isActive, isDeleted)
              if (result[0].isDeleted == true) {
                return res.status(406).send({ message: "Deleted" });
              }

              if (result[0].isActive == false) {
                return res.status(406).send({ message: "Disable" });
              }

              console.log(result);
              bcrypt
                .compare(req.body.Password, result[0].Password)
                .then((result) => {
                  if (result == true) {
                    return res
                      .status(409)
                      .send({ message: "Please use a diffirent password" });
                  } else {
                    bcrypt.hash(req.body.Password, 10).then((hash) => {
                      user
                        .updateOne(
                          { Email: decoded.Email },
                          { Password: hash },
                          function (err, resultUp) {
                            if (err) {
                              return res
                                .status(500)
                                .send({ ErrorOccured: error });
                            }
                            if (resultUp) {
                              return res
                                .status(200)
                                .send({ message: "Email Verified" });
                            }
                          }
                        )
                        .catch((error) => {
                          return res.status(500).send({ ErrorOccured: error });
                        });
                    });
                  }
                });
            }
          })
          .catch((error) => {
            return res.status(500).send({ ErrorOccured: error });
          });
      });
    }
  });
};

exports.CheckUser = (req, res) => {
let payload=_.pick(req.body,["email","phone"])
  user
    .find(payload)
    .then((result) => {
      if (result && result.length > 0) {
        res.status(200).send({ message: "exist" });
      } else res.status(404).send({ message: "not exists" });
    })
    .catch((err) => {
      res.status(500).send({ message: "servererror" });
    });
};

exports.SendNotification=async(req,res)=>{
  try{

let NotificationObj=new NotificationHandler(req.app.get("socketService"))
   await NotificationObj.sendNotification(req.userData._id,"test",{
    To: req.userData._id,
            Sender: req.userData._id,
            UserId: req.userData._id,
            Type: "notification",
            subject:"test",
            message:"your message here",
            //Link: link,
            Description: `testing`,
            Title: "You have a test",
   },"amanjain.3331@gmail.com")
//   CreateGeneralNotification(
//     req.userData._id,
//     req.userData._id,
//     "test",
//     "",
//     {
     
        
//       },
//    req.app.get("socketService")

// )
    
}catch(err){
  console.log(err)
}
  res.status(200).send({})
}

exports.ChangePasswordPhone = (req, res) => {
  sendOtp.verify(req.body.phone, req.body.otp, function (error, data) {
    if (error) {
      return res.status(500).send({
        ErrorOccured: error,
      });
    }
    if (data.type == "success") {
      user
        .findOne({ Phone: req.body.phone })

        .then((result) => {
          if (result.IsDeleted == true) {
            return res.status(406).send({ message: "Deleted" });
          }

          if (result.IsActive == true) {
            return res.status(406).send({ message: "Disable" });
          }

          if (result == null) {
            return res.status(404).send({ message: "No  Data Found" });
          } else {
            bcrypt
              .compare(req.body.Password, result.Password)
              .then((result) => {
                if (result == true) {
                  return res
                    .status(409)
                    .send({ message: "Please use a diffirent password" });
                } else {
                  console.log(result);
                  bcrypt.hash(req.body.Password, 10).then((hash) => {
                    user
                      .updateOne(
                        { Phone: req.body.phone },
                        { Password: hash },
                        function (err, resultUp) {
                          if (err) {
                            return res
                              .status(500)
                              .send({ ErrorOccured: error });
                          }
                          console.log(resultUp);
                          if (resultUp) {
                            return res
                              .status(200)
                              .send({ message: "Password updated" });
                          }
                        }
                      )
                      .catch((error) => {
                        return res.status(500).send({ ErrorOccured: error });
                      });
                  });
                }
              });
          }
        })
        .catch((error) => {
          return res.status(500).send({ error });
        });
    }

    if (data.type == "error") {
      return res.status(400).send({
        message: "OTP Verification Failed",
      });
    }
  });
};
