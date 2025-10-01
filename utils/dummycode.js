const bunyan = require("bunyan");
const MongoDBStream = require("bunyan-mongodb-stream");
const path = require("path");
const mongoose = require("mongoose"); // Import mongoose
const Log = require("../model/logModel");
const bunyanMongoDbLogger = require("bunyan-mongodb-logger");

const appLoggerFilePath = path.join(__dirname, "..", "logs", "app.log");

const appLogger = bunyan.createLogger({
  name: "appLogger",
  streams: [
    { level: "info", stream: process.stdout },
    { level: "error", path: "./logs/error.log" },
    {
      path: appLoggerFilePath,
    },
  ],
});

// // Define a simple log schema and model for bunyan-mongodb-stream
// const logSchema = new mongoose.Schema(
//   {},
//   { strict: false, capped: { size: 10000000, max: 10000 } }
// );
// const LogModel = mongoose.model("app_logs", logSchema);

// const mongoStream = new MongoDBStream({
//   model: LogModel, // Pass the mongoose model here
// });

// const mongoStream = new MongoDBStream({
//   model: Log, // Only pass the mongoose model
// });

const mongoStream = new MongoDBStream({
  model: Log,
});

mongoStream.on("error", (err) => {
  console.error("MongoDBStream error:", err);
});

const dbLogger1 = bunyan.createLogger({
  type: "raw",
  name: "dbLogger",
  streams: [{ type: "raw", level: "info", stream: mongoStream }],
});

// Create the Bunyan logger
// const mongoLogStream = new MongoDBStream({ model: Log }); // Correct instantiation

// const dbLogger = bunyan.createLogger({
//   name: "my-app-logger",
//   streams: [
//     {
//       level: "info",
//       stream: mongoLogStream,
//       type: "raw",
//     },
//   ],
//   serializers: bunyan.stdSerializers,
// });

// const mongoLogger = bunyanMongoDbLogger({
//   name: "mongoLogger",
//   streams: ["stdout", "mongodb"],
//   url: process.env.MONGO_URL,
//   collection: "mongo_logs",
//   level: "info",
//   model: Log, // Pass the mongoose model here
// });

// Example of writing logObject to a file
// const logObject = { key: "value" };
// fs.writeFileSync('log.txt', JSON.stringify(logObject)); // Correct way to write object as JSON string

const dbLogger = bunyanMongoDbLogger({
  name: "test-app",
  streams: ["stdout", "mongodb"],
  url: process.env.MONGO_URL, //"mongodb://localhost:27017/logger-test",
  level: "debug", // Log everything for testing
  collections: "logsDatabase",
});

module.exports = { appLogger, dbLogger };
