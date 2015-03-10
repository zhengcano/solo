var songsController = require('./songController.js');

module.exports = function (app) {

  app.route('/')
    .get(songsController.allSongs)
    .post(songsController.newSong);

  app.route('/savesong')
    .post(songsController.saveSong);

};
