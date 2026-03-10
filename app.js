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
const helmet = require("helmet");

const config = require("./config/config");
const Routes = require("./routes/index");
const CheckAuth = require("./middleware/CheckAuth");
const SocketService = require("./components/socket");
const Orders = require("./models/Orders");
const Workout = require("./models/WorkoutLibrary");
const MediaFiles = require("./models/MediaUploads");
const Program = require("./models/Programs");

// ─── App Setup ───────────────────────────────────────────────────────────────

const app = express();
const server = require("http").Server(app);

const BUILD_DIR = process.env.NODE_ENV === "PROD" ? "build_prod" : "build";
global.appRoot = path.resolve(__dirname);

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(morgan("dev"));

// ─── Socket ──────────────────────────────────────────────────────────────────

server.listen(config.port, () => console.log(`Express server running on port ${config.port}`));
app.set("socketService", new SocketService(server));

// ─── API Routes ──────────────────────────────────────────────────────────────

Routes(app);

// ─── Database ────────────────────────────────────────────────────────────────

mongoose
  .connect(config.db, { maxPoolSize: 10 })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(`Unable to connect to database. ${err.name}: ${err.message}`);
    process.exit(1);
  });

// ─── Frontend (Static) ───────────────────────────────────────────────────────

// Serve the React app root with SEO meta tag injection
app.get("/", (req, res) => {
  const filePath = path.resolve(__dirname, BUILD_DIR, "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Could not load app");
    res.send(
      data
        .replace(/__TITLE__/g, "Circled.fit")
        .replace(/__DESCRIPTION__/g, "Fitness on demand")
    );
  });
});

// Shared program page with OG meta tags
app.get("/public/sharedProgram/:id", (req, res) => {
  Program.findById(req.params.id)
    .lean()
    .then((program) => {
      if (!program) return res.sendFile(path.join(__dirname, BUILD_DIR, "index.html"));

      const filePath = path.resolve(__dirname, BUILD_DIR, "index.html");
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Could not load app");
        res.send(
          data
            .replace(/__TITLE__/g, program.Title)
            .replace(/__DESCRIPTION__/g, program.Description)
            .replace(
              /__IMAGE__/g,
              program.BannerImage ||
                "https://img.freepik.com/free-photo/athletes-floor-dumbbell-lift-with-one-hand_94347-858.jpg"
            )
            .replace(/__URL__/g, `https://circled.fit/public/sharedProgram/${req.params.id}`)
        );
      });
    })
    .catch(() => res.sendFile(path.join(__dirname, BUILD_DIR, "index.html")));
});

app.use(express.static(path.join(__dirname, BUILD_DIR)));

// Hash-agnostic JS file serving (supports cache-busted filenames)
app.get("/static/js/:fileName", (req, res) => {
  const jsDir = path.join(__dirname, BUILD_DIR, "static/js");
  const exactPath = path.join(jsDir, req.params.fileName);

  if (fs.existsSync(exactPath)) return res.sendFile(exactPath);

  const numberPart = req.params.fileName.match(/^(\d+|main)\./);
  if (numberPart) {
    const match = fs.readdirSync(jsDir).find((f) => {
      const fp = f.match(/^(\d+|main)\./);
      return fp && fp[1] === numberPart[1] && !f.endsWith(".map");
    });
    if (match) return res.sendFile(path.join(jsDir, match));
  }

  res.status(404).send("File not found");
});

app.get("/static/css/:fileName", (req, res) => {
  res.sendFile(path.join(__dirname, BUILD_DIR, "static/css", req.params.fileName));
});

app.get("/service-worker.js", (_req, res) => {
  res.sendFile(path.join(__dirname, BUILD_DIR, "service-worker.js"));
});

// ─── Admin / Utility Routes ───────────────────────────────────────────────────

// One-time schema migration: convert legacy media string arrays to objects
// Protected by CheckAuth so only authenticated users can trigger it
app.get("/updateSchema", CheckAuth, async (_req, res) => {
  try {
    const programs = await Workout.find();
    for (const program of programs) {
      program.Exercise.forEach((ex) => {
        ex.media = ex.media.map((m) => (typeof m === "string" ? { file: m } : m));
      });
      await Workout.updateOne({ _id: program._id }, { $set: { Exercise: program.Exercise } });
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Catch-all: serve React app for client-side routes
app.get("*", (_req, res) =>
  res.sendFile(path.join(__dirname, BUILD_DIR, "index.html"))
);

// ─── Error Handling ──────────────────────────────────────────────────────────

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ message: error.message });
});

// ─── Cron Jobs ───────────────────────────────────────────────────────────────

// Runs between midnight–5am every 5 minutes: marks unused media files for deletion
cron.schedule("*/5 0-5 * * *", async () => {
  try {
    const mediaItems = await MediaFiles.find({ savedToLibrary: true })
      .sort({ updatedAt: 1 })
      .limit(20)
      .lean();

    for (const item of mediaItems) {
      const regex = new RegExp(item.key);
      const [checkPrograms, checkWorkouts, checkOrders] = await Promise.all([
        Program.findOne(
          { "ExercisePlan.weeks.days.Exercise.media.file": { $regex: regex }, IsDeleted: false },
          { _id: 1 }
        ).lean(),
        Workout.findOne(
          { "ExercisePlan.weeks.days.Exercise.media.file": { $regex: regex } },
          { _id: 1 }
        ).lean(),
        Orders.findOne(
          { "Program.ExercisePlan.weeks.days.Exercise.media.file": { $regex: regex } },
          { _id: 1 }
        ).lean(),
      ]);

      const inUse = checkPrograms !== null || checkWorkouts !== null || checkOrders !== null;
      await MediaFiles.updateOne(
        { _id: item._id },
        { $set: { markedForDeletion: !inUse && !item.savedToLibrary, updatedAt: new Date() } }
      );
    }
  } catch (err) {
    console.error("Cron job error:", err.message);
  }
});

module.exports = app;
