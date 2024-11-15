require("dotenv").config();
module.exports = {
  port:process.env.PORT||3001,
  db:
    process.env.NODE_ENV === "DEV"
      ? process.env.MONGODB_DEV_CONNECTION_STRING
      : process.env.MONGODB_PROD_CONNECTION_STRING
};
