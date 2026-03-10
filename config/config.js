require("dotenv").config();

// DEV=3001 so frontend dev server can use 3000 and proxy /api to backend
const port =
  process.env.NODE_ENV === "DEV"
    ? Number(process.env.APP_DEV_PORT) || 3001
    : Number(process.env.APP_PROD_PORT) || 3001;

module.exports = {
  port,
  db: process.env.MONGODB_PROD_CONNECTION_STRING,
};
