const mongoose = require('mongoose');

const numSerieSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('NumSerie', numSerieSchema);
