const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Operation', operationSchema);
