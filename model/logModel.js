const mongoose = require("mongoose");

const LogEntrySchema = new mongoose.Schema(
  {
    name: String,
    hostname: String,
    pid: Number,
    level: Number,
    msg: String,
    time: Date,
    v: Number,
  },
  { timestamps: true, strict: false }
);

const Log =
  mongoose.models["app_logs123"] ||
  mongoose.model("app_logs123", LogEntrySchema);

module.exports = Log;
