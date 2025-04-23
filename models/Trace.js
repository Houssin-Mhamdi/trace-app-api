const mongoose = require("mongoose");

const traceSchema = new mongoose.Schema({
  numSerie: String,
  operation: String,
  // trace: String,
  date: Date,
});

module.exports = mongoose.model("Trace", traceSchema);
