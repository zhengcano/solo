var Song    = require('./songModel.js'),
    User    = require('../users/userModel.js'),
    Q       = require('q'),
    util    = require('../config/utils.js'),
    jwt     = require('jwt-simple'),
    fs      = require('fs'),
    Layers   = require('../layers/layerModel.js');

module.exports = {
  saveSong: function(req, res, next) {
    var buf = new Buffer(req.body.blob, 'base64'); // decode
    fs.writeFile("client/audio/" + req.body.title + ".wav", buf, function(err) {
      if(err) {
        console.log("err", err);
      } else {
        return res.json({'status': 'success'});
      }
    }) 
  },

  saveLayer: function(req, res, next) {
    var buf = new Buffer(req.body.blob, 'base64'); // decode
    fs.writeFile("client/audio/layers/" + req.body.title + ".wav", buf, function(err) {
      if(err) {
        console.log("err", err);
      } else {
        return res.json({'status': 'success'});
      }
    }) 
  },

  getLayers: function(req, res, next){
    var user = req.body.user;
    var title = req.body.title;

    var findTrack = Q.nbind(Song.findOne, Song);
    findTrack({user: user, title: title})
      .then(function (song) {
        var layerList = song.layers;
        var findAll = Q.nbind(Layers.find, Layers);
        findAll({'title':{$in: layerList}})
          .then(function (layers) {
            res.json(layers);
          })
          .fail(function (error) {
            next(error);
          });
      })
      .fail(function (error) {
        next(error);
      });
  },

  allSongs: function (req, res, next) {

    var findAll = Q.nbind(Song.find, Song);

    findAll()
      .then(function (songs) {
        res.json(songs);
      })
      .fail(function (error) {
        next(error);
      });

  },

  mySongs: function (req, res, next) {
    var token = req.headers['x-access-token'];

    var user = jwt.decode(token, 'secret');
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: user.username})
      .then(function (foundUser) {
        var findAll = Q.nbind(Song.find, Song);

        findAll({'title':{$in: foundUser.usersongs}})
          .then(function (songs) {
            res.json(songs);
          })
          .fail(function (error) {
            next(error);
          });
      })
      .fail(function (error) {
        next(error);
      });

  },

  newSong: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'secret');
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: user.username})
      .then(function (foundUser) {
        if (foundUser) {
          var user = foundUser.username;
          var title = req.body.title;
          var song = new Song;
          foundUser.usersongs.push(title)
          foundUser.save();
          song.user = user;
          song.title = title;
          console.log(song)
          song.save();
          res.send(201);
        }
      })
      .fail(function (error) {
        next(error);
      });

  },

  newLayer: function (req, res, next) {
  var user = req.body.user;
  var song = req.body.song;
  var title = req.body.title;

  var findSong = Q.nbind(Song.findOne, Song);
  findSong({user: user, title: song})
    .then(function (foundSong) {
      if (foundSong) {
        var layers = new Layers;
        foundSong.layers.push(title)
        foundSong.save();
        layers.user = user;
        layers.title = title;
        layers.song = song;
        console.log(layers);
        layers.save();
        res.send(201);
      }
    })
    .fail(function (error) {
      next(error);
    });

  }

};
