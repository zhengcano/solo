var Song    = require('./songModel.js'),
    User    = require('../users/userModel.js'),
    Q       = require('q'),
    util    = require('../config/utils.js'),
    jwt     = require('jwt-simple'),
    fs      = require('fs');

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

  findSong: function (req, res, next, code) {
    var findLink = Q.nbind(Song.findOne, Song);
    findLink({code: code})
      .then(function (song) {
        if (song) {
          req.navLink = song;
          next();
        } else {
          next(new Error('Song not added yet'));
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  allSongs: function (req, res, next) {
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
          res.redirect('/#/songs');

          // var url = req.body.url;
          // console.log(req.body);
          // if (!util.isValidUrl(url)) {
          //   return next(new Error('Not a valid url'));
          // }

          // var createLink = Q.nbind(Song.create, Song);
          // var findLink = Q.nbind(Song.findOne, Song);

          // findLink({url: url})
          //   .then(function (match) {
          //     if (match) {
          //       foundUser.userlinks.push(match.url);
          //       foundUser.save();
          //       res.send(match);
          //     } else {
          //       return  util.getUrlTitle(url);
          //     }
          //   })
          //   .then(function (title) {
          //     if (title) {
          //       var newLink = {
          //         url: url,
          //         visits: 0,
          //         base_url: req.headers.origin,
          //         title: title
          //       };
          //       return createLink(newLink);
          //     }
          //   })
          //   .then(function (createdLink) {
          //     if (createdLink) {
          //       foundUser.userlinks.push(createdLink.url);
          //       foundUser.save();
          //       res.json(createdLink);
          //     }
          //   })
          //   .fail(function (error) {
          //     next(error);
          //   });



        }
      })
      .fail(function (error) {
        next(error);
      });

  }

};
