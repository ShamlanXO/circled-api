const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, "tempAuth");
    return res.status(200).send({ message: "tokenVerified" });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
