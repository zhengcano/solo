var mongoose = require('mongoose');

var LayerSchema = new mongoose.Schema({

  title: String,
  user: String,
  song: String,
  collaborator: String

});

module.exports = mongoose.model('Layers', LayerSchema);