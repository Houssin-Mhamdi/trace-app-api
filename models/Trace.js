const mongoose = require("mongoose");

const traceSchema = new mongoose.Schema({
  numSerie: String,
  operation: String,
  traceDesc: String,
  date: Date,
});

module.exports = mongoose.model("Trace", traceSchema);
