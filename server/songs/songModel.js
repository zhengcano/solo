var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({

  title: String,
  length: String,
  user: String,
  layers: Array

});

module.exports = mongoose.model('Song', SongSchema);
