require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const { auth } = require("./middleware/auth");

const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const app = express();
const PORT = 3000;

const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const reqLogFilePath = path.join(__dirname, "logs", "requests.log");
const reqLogStream = fs.createWriteStream(reqLogFilePath, { flags: "a" });
app.use(morgan("combined", { stream: reqLogStream }));

// const bunyanMongoDbLogger = require("bunyan-mongodb-logger");

// const logger = bunyanMongoDbLogger({
//   name: "test-app",
//   streams: ["stdout", "mongodb"],
//   url: process.env.MONGO_URL, //"mongodb://localhost:27017/logger-test",
//   level: "debug", // Log everything for testing
//   collections: "logsDatabase",
// });

// logger.error(new Error("Test error log"), "This is a test error");
// logger.info("This is a test info log");

mongoose
  .connect(process.env.MONGO_URL, {
    autoIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/files", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
