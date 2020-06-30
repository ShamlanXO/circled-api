const jwt = require("jsonwebtoken");
const user = require("../models/user");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "s3cr3t");
    req.userData = decoded;
    user
      .find({ Email: decoded.Email })
      .then(result => {
        if (result.length < 1 || result[0].IsActive == false) {
          throw "invalid";
        } else return next();
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
