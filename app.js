const express = require("express");
const Program = require("./models/Programs");
const morgan = require("morgan");
const app = express();
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const User=require("./models/user")
const bodyParser = require("body-parser");
const config = require("./config/config");
const helmet = require("helmet");
const Routes = require("./routes/index");
const Orders= require("./models/Orders")
//const swaggerDocument = require("./documentation/swagger.json");
//redist
const axios=require("axios");
const fs = require("fs");

var ObjectID = require("mongodb").ObjectID;

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

 app.set("socketService", new SocketService(server));
app.use(helmet());

//Security headers in every response to tackle cors errors
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));



app.use(morgan("dev"));
app

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
      


      Orders.updateOne(
        {
          "_id" : ObjectID("5f84061d49e13628a2468067") 

      },
      {
     
          "Program.ExercisePlan.0.0.Title":"conditionEdit-server"
        
  
      }
      ).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })


    }
  }
);

    


app.get('/', function(req, res) {
console.log('runnning')
  const filePath = path.resolve(__dirname, "build", "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    data = data
      .replace(/__TITLE__/g, "Home Page")
      .replace(/__DESCRIPTION__/g, "Home page description.");

    res.send(data)
  });

 
  //res.sendFile(path.join(__dirname, 'build', 'index.html'));




});


app.get('/public/sharedProgram/:id', function(req, res) {

  Program.findById(req.params.id).then((program) => {
    if(program)
{
  const filePath = path.resolve(__dirname, "build", "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

  
    data = data
      .replace(/__TITLE__/g, program.Title)
      .replace(/__DESCRIPTION__/g, program.Description)
      .replace(/__IMAGE__/g, program.BannerImage?program.BannerImage: "https://img.freepik.com/free-photo/athletes-floor-dumbbell-lift-with-one-hand_94347-858.jpg?size=626&ext=jpg")
      .replace(/__URL__/g,"https://figgs.co/public/sharedProgram/"+req.params.id)
    res.send(data)
  });
}
else
{

  res.sendFile(path.join(__dirname, 'build', 'index.html'))
}
  })
  

    
  
   
    //res.sendFile(path.join(__dirname, 'build', 'index.html'));
  
  
  
  
  });



app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname, "build/index.html"))
);


// app.get('*', function(req, res) {
  
   
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
  
  
  
  
//   });


//app.use(express.static(__dirname+'/build'))
// const saveData=(firstName,lastName,displayName,email)=>{
//   new Contact({firstName,lastName,displayName,email}).save((err,newUser)=>{

//     console.log(err)
//     console.log(newUser)
//   })
// }

// const fetchMore=(link)=>{
//   axios.get(link,{headers:{Authorization:"Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6Il83MTI4WDNXeGN6M2R1S1JNYllSU3JCTEYzNkdJTVh4MEdhT05Od3BvSm8iLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84Njk1YjgzZC1jNjkyLTQ3ZWYtYWQ3YS0zNzZjYmNlMzY2NGYvIiwiaWF0IjoxNjA0NjQ3Mjc2LCJuYmYiOjE2MDQ2NDcyNzYsImV4cCI6MTYwNDY1MTE3NiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkUyUmdZR2dYMEZoL3ZrZDlwcnlML3g4VHh0K2hvZmNUQk5SMnZEMVlxTjMvOHJ0dDJUa0EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6InNsb3JnZSIsImFwcGlkIjoiZDlmYTExYWMtZDE5Mi00Y2U4LTk4NjYtYmIyZDJjNjg2ZGZmIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJKYWluIiwiZ2l2ZW5fbmFtZSI6IkFtYW4iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxNzEuNzkuMTQ2LjE1MSIsIm5hbWUiOiJBbWFuIEphaW4iLCJvaWQiOiI2NDMwNjg5Yi05MjYzLTQ1YjctYTM5Yy0yYWU3NzU3MzkwYjciLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzNGRkY5QTZGOTI4QyIsInJoIjoiMC5BQUFBUGJpVmhwTEc3MGV0ZWpkc3ZPTm1UNndSLXRtUzBlaE1tR2E3TFN4b2JmODlBSkUuIiwic2NwIjoiVXNlci5SZWFkIFVzZXIuUmVhZEJhc2ljLkFsbCBwcm9maWxlIG9wZW5pZCBlbWFpbCIsInN1YiI6ImlEVWtHUHUyWGxJeW9lUkdqa3RDNWluRmhWZGVWZE5iandoVW04VnFFSUkiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiI4Njk1YjgzZC1jNjkyLTQ3ZWYtYWQ3YS0zNzZjYmNlMzY2NGYiLCJ1bmlxdWVfbmFtZSI6ImFtYW5qYWluQGprbHUuZWR1LmluIiwidXBuIjoiYW1hbmphaW5AamtsdS5lZHUuaW4iLCJ1dGkiOiJMSjBFQmg3RFYwbWlMVEJzUEw1SkFRIiwidmVyIjoiMS4wIiwieG1zX3N0Ijp7InN1YiI6IkVVSENPd003MlloTl9DazFKN0o0U19aSFdRV1NfR0c3LU1QUGg4SkxXYXMifSwieG1zX3RjZHQiOjEzNjE1MjY0Mjl9.hn8CFsqw0hfGYGQ2DBsvtOJpNFLp0ug8CvSO2-al_uIsFZmOoULr1OdK7W_lOtOCA1jSr37DW-9RayMSAr41MO-BFdqP3wvlTId0k0X47kbBJRoz5tu_SlezRF7XeHQe08g4R0wFfQrh_71mi8uHPGFTHdey8rM_1jARKZjDo9HomzlEOyHL5dclO5be4TV6udcEKl1Rso005QEgd6HWOARfbbM5Rwwk7ZfFIKNF3O9IE_RYKSgVN9prQ2bNmf5ifzpPuGcXK7p81ibkuuwfzJNwlu2QG72NXFBxc3K_hqq24xXLsvRq-EZLDUp4ujyu-kmEv-lligKJGWhRbUb9zA"}}).then((data)=>{

//     data.data.value.map(item=>{
//       saveData(item.givenName,item.surname,item.displayName,item.mail)
//     })

//     if(data.data["@odata.nextLink"]){
//       fetchMore(data.data["@odata.nextLink"])
//     }




//     })


// }


// app.get('/getUsers', (request, response) => {
//   console.log("hey")
 
//   axios.get("https://graph.microsoft.com/v1.0/users",{headers:{Authorization:"Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6Il83MTI4WDNXeGN6M2R1S1JNYllSU3JCTEYzNkdJTVh4MEdhT05Od3BvSm8iLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84Njk1YjgzZC1jNjkyLTQ3ZWYtYWQ3YS0zNzZjYmNlMzY2NGYvIiwiaWF0IjoxNjA0NjQ3Mjc2LCJuYmYiOjE2MDQ2NDcyNzYsImV4cCI6MTYwNDY1MTE3NiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkUyUmdZR2dYMEZoL3ZrZDlwcnlML3g4VHh0K2hvZmNUQk5SMnZEMVlxTjMvOHJ0dDJUa0EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6InNsb3JnZSIsImFwcGlkIjoiZDlmYTExYWMtZDE5Mi00Y2U4LTk4NjYtYmIyZDJjNjg2ZGZmIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJKYWluIiwiZ2l2ZW5fbmFtZSI6IkFtYW4iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxNzEuNzkuMTQ2LjE1MSIsIm5hbWUiOiJBbWFuIEphaW4iLCJvaWQiOiI2NDMwNjg5Yi05MjYzLTQ1YjctYTM5Yy0yYWU3NzU3MzkwYjciLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzNGRkY5QTZGOTI4QyIsInJoIjoiMC5BQUFBUGJpVmhwTEc3MGV0ZWpkc3ZPTm1UNndSLXRtUzBlaE1tR2E3TFN4b2JmODlBSkUuIiwic2NwIjoiVXNlci5SZWFkIFVzZXIuUmVhZEJhc2ljLkFsbCBwcm9maWxlIG9wZW5pZCBlbWFpbCIsInN1YiI6ImlEVWtHUHUyWGxJeW9lUkdqa3RDNWluRmhWZGVWZE5iandoVW04VnFFSUkiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiI4Njk1YjgzZC1jNjkyLTQ3ZWYtYWQ3YS0zNzZjYmNlMzY2NGYiLCJ1bmlxdWVfbmFtZSI6ImFtYW5qYWluQGprbHUuZWR1LmluIiwidXBuIjoiYW1hbmphaW5AamtsdS5lZHUuaW4iLCJ1dGkiOiJMSjBFQmg3RFYwbWlMVEJzUEw1SkFRIiwidmVyIjoiMS4wIiwieG1zX3N0Ijp7InN1YiI6IkVVSENPd003MlloTl9DazFKN0o0U19aSFdRV1NfR0c3LU1QUGg4SkxXYXMifSwieG1zX3RjZHQiOjEzNjE1MjY0Mjl9.hn8CFsqw0hfGYGQ2DBsvtOJpNFLp0ug8CvSO2-al_uIsFZmOoULr1OdK7W_lOtOCA1jSr37DW-9RayMSAr41MO-BFdqP3wvlTId0k0X47kbBJRoz5tu_SlezRF7XeHQe08g4R0wFfQrh_71mi8uHPGFTHdey8rM_1jARKZjDo9HomzlEOyHL5dclO5be4TV6udcEKl1Rso005QEgd6HWOARfbbM5Rwwk7ZfFIKNF3O9IE_RYKSgVN9prQ2bNmf5ifzpPuGcXK7p81ibkuuwfzJNwlu2QG72NXFBxc3K_hqq24xXLsvRq-EZLDUp4ujyu-kmEv-lligKJGWhRbUb9zA"}}).then((data)=>{
// console.log(data)
//   data.data.value.map(item=>{
//     saveData(item.givenName,item.surname,item.displayName,item.mail)
//   })
//   fetchMore(data.data["@odata.nextLink"])




//   })




// });



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
app.listen(config.port, () => console.log("Express server is running"));
module.exports = app;
