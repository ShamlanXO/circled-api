const jwt = require("jsonwebtoken");
const user = require("../models/user");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "s3cr3t");
    req.userData = decoded;
    user
      .find({ _id: decoded._id })
      .then(result => {
        if (result.length < 1 || result[0].IsActive == false) {
          throw "invalid";
        } else{ 
          
          req.userData={_id:result[0]._id,email:result[0].email,figgsId:result[0].figgsId,name:result[0].name,profilePic:result[0].profilePic}
          return next()};
      })
      .catch(err => {
        return res.status(401).json({
          message: "Invalid or expired token"
        });
      });
  } catch (error) {
    console.log("invalid");
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
