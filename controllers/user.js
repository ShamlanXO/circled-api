const user = require("../models/user");
const Verify=require("../models/Verify")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SendOtp = require("../components/sendOtp");
const aqp = require("api-query-params");
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

exports.CreateUser = (req, res) => {

  const decoded = jwt.verify(req.body.token, "s3cr3t")
console.log(decoded)
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          if (err) {
            return res
              .status(500)
              .send({ message: "Password Hash error", Error: err });
          }

          let time =new Date();
         
          delete req.body.email
        delete req.body.phone
          const User = new user({...req.body,uuid:decoded.uuid,[decoded.type]: decoded.uuid});
          User.save()
            .then((result) => {
              const token = jwt.sign(
                { _id: result._id },
                "s3cr3t",
                { expiresIn: "30d"  }
              )
      
              return res.status(201).send({ userData:result,message: "User Created",token:token });

            })
            .catch((error) => {
              console.log(error)
              return res
                .status(500)
                .send({ message: "Error Creating User", ErrorOccured: error });
            });
        });
     
       
 
};

exports.UserLogin = (req, res) => {
  user
    .find({$or:[{email: req.body.email},{phone: req.body.phone}] })
    .then((result) => {
      if (result.length < 1) {
        return res
          .status(404)
          .send({ message: "No User exists with this mail address" });
      }  else {
        bcrypt.compare(req.body.password, result[0].password, function (
          err,
          same
        ) {
          if (err) {
            return res.status(500).send({
              message: "Error Comparing Passwords",
              ErrorOccured: err,
            });
          }
          if (same) {
            const token = jwt.sign(
              {  _id: result[0]._id },
              "s3cr3t",
              { expiresIn: req.body.remember ? "30d" : "7d" }
            );

            return res.status(200).send({
              message: "User Auth Successful",
              AuthToken: token,
              ...result[0]
            });
          } else {
            return res.status(401).send({
              message: "Invalid password",
            });
          }
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UserUpdate = (req, res) => {
  console.log(req.userData)
  delete req.body._id
  delete req.body.phone
  delete req.body.email
  user
    .updateOne({ _id: req.userData._id}, req.body, function (err, result) {
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

exports.UserSensitiveDataUpdate = (req, res) => {
  console.log(req.userData)
  const decoded = jwt.verify(req.body.token, "s3cr3t")
  user
    .updateOne({ _id: req.userData._id},{[decoded.type]: decoded.uuid}, function (err, result) {
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
        if (result[0].IsDeleted == true) {
          return res.status(406).send({ message: "Deleted" });
        }

        if (result[0].IsActive == false) {
          return res.status(406).send({ message: "Disable" });
        }

        return res.status(200).send({
          message: "User Exists with this data",
          Id: result[0]._id,
          Email: result[0].Email,
        });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.ChangePassword = (req, res) => {
  user
    .findOne({ _id: req.params.Id })
    .then((result) => {
      if (result) {
        bcrypt
          .compare(req.body.OldPassword, result.Password)
          .then((resultON) => {
            if (resultON === true) {
              return res
                .status(409)
                .send({ message: "Old Password cant be the new password" });
            } else {
              bcrypt
                .hash(req.body.NewPassword, 10)
                .then((hash) => {
                  user.updateOne(
                    { _id: req.params.Id },
                    { Password: hash },
                    function (err, doc) {
                      if (err) {
                        return res.status(500).send({ ErrorOccured: err });
                      }
                      if (doc) {
                        return res.status(200).send({ message: doc });
                      }
                    }
                  );
                })
                .catch((error) => {
                  return res.status(500).send({ ErrorOccured: error });
                });
            }
          });
      } else {
        return res.status(404).send({ message: "User Not Found" });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.ChangePasswordEmail = (req, res) => {
  user.findOne({ Email: req.body.Email }).then((userData) => {
    if (!userData) {
      return res.status(404).send({ message: "No  Data Found" });
    } else {
      jwt.verify(req.body.token, "s3cr3t" + userData.Secret.reset, function (
        err,
        decoded
      ) {
        console.log(decoded);
        user
          .find({ Email: decoded.Email })

          .then((result) => {
            console.log(result);
            if (result.length < 1) {
              return res.status(404).send({ message: "No  Data Found" });
            } else {
              if (result[0].IsDeleted == true) {
                return res.status(406).send({ message: "Deleted" });
              }

              if (result[0].IsActive == true) {
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

exports.ChangePasswordPhone = (req, res) => {
  console.log(req.body);

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
