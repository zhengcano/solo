var Link    = require('./linkModel.js'),
    User    = require('../users/userModel.js'),
    Q       = require('q'),
    util    = require('../config/utils.js'),
    jwt     = require('jwt-simple');

module.exports = {
  findUrl: function (req, res, next, code) {
    var findLink = Q.nbind(Link.findOne, Link);
    findLink({code: code})
      .then(function (link) {
        if (link) {
          req.navLink = link;
          next();
        } else {
          next(new Error('Link not added yet'));
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  allLinks: function (req, res, next) {
    var token = req.headers['x-access-token'];

    var user = jwt.decode(token, 'secret');
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: user.username})
      .then(function (foundUser) {
        var findAll = Q.nbind(Link.find, Link);

        findAll({'url':{$in: foundUser.userlinks}})
          .then(function (links) {
            res.json(links);
          })
          .fail(function (error) {
            next(error);
          });
      })
      .fail(function (error) {
        next(error);
      });

  },

  newLink: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'secret');
    var findUser = Q.nbind(User.findOne, User);
    findUser({username: user.username})
      .then(function (foundUser) {
        if (foundUser) {

          var url = req.body.url;
          console.log(req.body);
          if (!util.isValidUrl(url)) {
            return next(new Error('Not a valid url'));
          }

          var createLink = Q.nbind(Link.create, Link);
          var findLink = Q.nbind(Link.findOne, Link);

          findLink({url: url})
            .then(function (match) {
              if (match) {
                foundUser.userlinks.push(match.url);
                foundUser.save();
                res.send(match);
              } else {
                return  util.getUrlTitle(url);
              }
            })
            .then(function (title) {
              if (title) {
                var newLink = {
                  url: url,
                  visits: 0,
                  base_url: req.headers.origin,
                  title: title
                };
                return createLink(newLink);
              }
            })
            .then(function (createdLink) {
              if (createdLink) {
                foundUser.userlinks.push(createdLink.url);
                foundUser.save();
                res.json(createdLink);
              }
            })
            .fail(function (error) {
              next(error);
            });



        }
      })
      .fail(function (error) {
        next(error);
      });

  },

  navToLink: function (req, res, next) {
    var link = req.navLink;
    link.visits++;
    link.save(function (err, savedLink) {
      if (err) {
        next(err);
      } else {
        res.redirect(savedLink.url);
      }
    });
  }

};
