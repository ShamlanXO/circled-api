require("dotenv").config();
console.log("Environment:", process.env.NODE_ENV);
module.exports = {

  port:process.env.NODE_ENV==="DEV"?3000:process.env.NODE_ENV==="PROD"?3001:3000,
  db: process.env.MONGODB_PROD_CONNECTION_STRING
};
