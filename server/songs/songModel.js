var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({

  location: String,
  title: String,
  length: String,
  user: String

});

SongSchema.pre('save', function(next){

  next();
});

module.exports = mongoose.model('Song', SongSchema);
