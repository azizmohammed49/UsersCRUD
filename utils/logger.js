const bunyan = require("bunyan");

const path = require("path");
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

const dbLogger = bunyanMongoDbLogger({
  name: "test-app",
  streams: ["stdout", "mongodb"],
  url: process.env.MONGO_URL,
  level: "debug",
  collections: "logsDatabase",
});

module.exports = { appLogger, dbLogger };
