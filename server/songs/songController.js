var Song    = require('./songModel.js'),
    User    = require('../users/userModel.js'),
    Q       = require('q'),
    util    = require('../config/utils.js'),
    jwt     = require('jwt-simple');

module.exports = {
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
        // var findAll = Q.nbind(Song.find, Song);

        // findAll({'url':{$in: foundUser.userlinks}})
        //   .then(function (links) {
        //     res.json(links);
        //   })
        //   .fail(function (error) {
        //     next(error);
        //   });
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
