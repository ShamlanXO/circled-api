require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

const config = require("./config/config");
const helmet = require("helmet");
const Routes = require("./routes/index");
const CheckAuth = require("./middleware/CheckAuth");
const SocketService = require("./components/socket");
const Orders = require("./models/Orders");
const Workout = require("./models/WorkoutLibrary");
const MediaFiles = require("./models/MediaUploads");
const Program = require("./models/Programs");

const app = express();
const server = require("http").Server(app);

const BUILD_DIR = process.env.NODE_ENV === "PROD" ? "build_prod" : "build";
global.appRoot = path.resolve(__dirname);

app.use(compression());
server.listen(config.port, () => console.log("Express server is running"));
app.set("socketService", new SocketService(server));
app.use(helmet());

//Security headers in every response to tackle cors errors
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.use(morgan("dev"));

// app
// app.get("/", (req, res) => {
//   res.redirect("/api/welcome");
// });
// app.get("/api/welcome", (req, res) => {
//   return res
//     .status(200)
//     .send({ message: `LMS API IS UP AND RUNNING SINCE ${process.uptime()}` });
// });
// app.get("/robots.txt", function(req, res) {
//   res.type("text/plain");
//   res.send("User-agent: *\nDisallow: /");
// });
// app.get("/favicon.ico", (req, res) => res.status(204));
Routes(app);

mongoose.connect(config.db, {
  maxPoolSize: 10,
})
  .then(() => {})
  .catch((err) => {
    console.log(`Unable to connect to database. ${err.name}: ${err.message}`);
    process.exit(1);
  });

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



app.get("/", (req, res) => {
  const filePath = path.resolve(__dirname, BUILD_DIR, "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    data = data
      .replace(/__TITLE__/g, "Circled.fit")
      .replace(/__DESCRIPTION__/g, "Fitness on demand");

    res.send(data);
  });

  //res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/public/sharedProgram/:id", (req, res) => {
  Program.findById(req.params.id).lean().then((program) => {
    if (program) {
      const filePath = path.resolve(__dirname, BUILD_DIR, "index.html");
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          return console.log(err);
        }

        data = data
          .replace(/__TITLE__/g, program.Title)
          .replace(/__DESCRIPTION__/g, program.Description)
          .replace(
            /__IMAGE__/g,
            program.BannerImage
              ? program.BannerImage
              : "https://img.freepik.com/free-photo/athletes-floor-dumbbell-lift-with-one-hand_94347-858.jpg?size=626&ext=jpg"
          )
          .replace(
            /__URL__/g,
            "https://figgs.co/public/sharedProgram/" + req.params.id
          );
        res.send(data);
      });
    } else {
      res.sendFile(path.join(__dirname, BUILD_DIR, "index.html"));
    }
  });
});

app.use(express.static(path.join(__dirname, BUILD_DIR)));
app.get("/static/js/:fileName", (req, res) => {
  const requestedFileName = req.params.fileName;
  const jsDir = path.join(__dirname, BUILD_DIR, "static/js");
  const filePathWithHash = path.join(jsDir, requestedFileName);

  if (fs.existsSync(filePathWithHash)) {
    return res.sendFile(filePathWithHash);
  }
  const numberPart = requestedFileName.match(/^(\d+|main)\./);
  if (numberPart) {
    const number = numberPart[1];
    const filesInFolder = fs.readdirSync(jsDir);
    const matchingFile = filesInFolder.find((file) => {
      const fileNumberPart = file.match(/^(\d+|main)\./);
      return fileNumberPart && fileNumberPart[1] === number && !file.endsWith(".map");
    });
    if (matchingFile) {
      return res.sendFile(path.join(jsDir, matchingFile));
    }
  }
  res.status(404).send("File not found");
});





app.get("/static/css/:fileName", (req, res) => {
  res.sendFile(path.join(__dirname, BUILD_DIR, "static/css", req.params.fileName));
});
app.get("/service-worker.js", (_req, res) => {
  res.sendFile(path.join(__dirname, BUILD_DIR, "service-worker.js"));
});

// B-11 fix: protect the /updateSchema route with authentication so only logged-in users can run it
app.get("/updateSchema", CheckAuth, async (_req, res) => {
  try {
    const programs = await Workout.find();
    for (const program of programs) {
      program.Exercise.forEach((i) => {
        i.media = i.media.map((j) =>
          typeof j === "string" ? { file: j } : j
        );
      });
      await Workout.updateOne(
        { _id: program._id },
        { $set: { Exercise: program.Exercise } }
      );
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




app.get("*", (_req, res) =>
  res.sendFile(path.join(__dirname, BUILD_DIR, "index.html"))
);

//Middlewares for error handling and presentation.
app.use((req, res, next) => {
  const error = new Error("Not found");
  // B-13 fix: error.status is a property, not a function
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});



cron.schedule("*/5 0-5 * * *", async () => {
  const mediaItems = await MediaFiles.find({ savedToLibrary: true })
    .sort({ updatedAt: 1 })
    .limit(20)
    .lean();

  for (const item of mediaItems) {
    const regex = new RegExp(item.key);
    const [checkPrograms, checkWorkouts, checkOrders] = await Promise.all([
      Program.findOne(
        {
          "ExercisePlan.weeks.days.Exercise.media.file": { $regex: regex },
          IsDeleted: false,
        },
        { _id: 1 }
      ).lean(),
      Workout.findOne(
        { "ExercisePlan.weeks.days.Exercise.media.file": { $regex: regex } },
        { _id: 1 }
      ).lean(),
      Orders.findOne(
        {
          "Program.ExercisePlan.weeks.days.Exercise.media.file": { $regex: regex },
        },
        { _id: 1 }
      ).lean(),
    ]);

    const inUse = checkPrograms !== null || checkOrders !== null || checkWorkouts !== null;
    const markedForDeletion = !inUse && !item.savedToLibrary;

    await MediaFiles.updateOne(
      { _id: item._id },
      { $set: { markedForDeletion, updatedAt: new Date() } }
    );
  }
});

module.exports = app;
