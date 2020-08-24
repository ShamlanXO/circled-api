const express = require("express");

const morgan = require("morgan");
const app = express();
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const User=require("./models/user")
const bodyParser = require("body-parser");
const config = require("./config/config");
const helmet = require("helmet");
const Routes = require("./routes/index");

//const swaggerDocument = require("./documentation/swagger.json");
//redist





const cors = require("cors");
const compression = require("compression");
const path = require("path");
const SocketService=require("./components/socket")
const server = require('http').Server(app);
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 150, // limit each IP to 150 requests per windowMs
//   message: "Too many requests sent from your ip in short span of time"
// });

// //  apply to all requests
// app.use(limiter);
global.appRoot = path.resolve(__dirname);
require("dotenv").config();
app.use(compression());
server.listen(config.port, () => console.log("Express server is running"));
 app.set("socketService", new SocketService(server));
app.use(helmet());

//Security headers in every response to tackle cors errors
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));



app.use(morgan("dev"));
app
app.get("/", (req, res) => {
  res.redirect("/api/welcome");
});
app.get("/api/welcome", (req, res) => {
  return res
    .status(200)
    .send({ message: `LMS API IS UP AND RUNNING SINCE ${process.uptime()}` });
});
app.get("/robots.txt", function(req, res) {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
});
app.get("/favicon.ico", (req, res) => res.status(204));
Routes(app);


mongoose.connect(
  config.db,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useUnifiedTopology: true,
    poolSize: 10
  },
  function(err) {
    if (err) {
      console.log(
        `Unable to Connect to LMS Database. ${err.name} ${err.message}`
      );
      process.exit(1);
    } else {
      console.log(new Date());
      console.error("Successfully connected to LMS Database");

      var rtg   = require("url").parse("redis://redistogo:c6e217b1af8286546da4e15fc25afea0@scat.redistogo.com:9459/");
      var redis = require("redis").createClient(rtg.port, rtg.hostname);
      
      redis.auth(rtg.auth.split(":")[1]);
      app.set("redis", redis);
      redis.on('connect', function() {
     
        console.log('connected');
        User.findOne({}).sort({createdAt:-1}).then((user) =>{
let figgsId=user.figgsId
console.log(figgsId)
let id=Number(figgsId.split("-")[1])

redis.set("figgsId",id,(err,data) =>{
  
})



        }).catch((err) =>{
          console.log(err)
        })
      });
      





    }
  }
);

//Middlewares for error handling and presentation.
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status);
  res.json({
    message: error.message
  });
});

module.exports = app;
