const jwt = require("jsonwebtoken");
const user = require("../models/user");
const stripe = require('stripe')('sk_test_51NzgiTKrByvmoNXFBNMnoIYV2fWTAwgzKtW9tXB00vYibQcHMCKrxgTIhwxR48XxMf38pFgpjd5tbORcWNC1e95T00upfdzlOL');
module.exports =async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "s3cr3t");
    req.userData = decoded;
    user
      .findOne({ _id: decoded._id })
      .then(async(result) => {
        if (!result || result.IsActive == false) {
          throw "invalid";
        } else {
           
         
         
          req.userData = {
            _id: result._id,
            email: result.email,
            figgsId: result.figgsId,
            name: result.name,
            profilePic: result.profilePic,
            type: result.type,
            stripeUserId:result.stripeUserId,
            IsActive: result.IsActive,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          };
          return next();
        }
      })
      .catch((err) => {
        console.log(err)
        return res.status(401).json({
          message: "Invalid or expired token",
        });
      });
  } catch (error) {
    console.log("invalid");
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
