var songsController = require('./songController.js');

module.exports = function (app) {


  app.route('/')
    .get(songsController.mySongs)
    .post(songsController.newSong);

  app.route('/savesong')
    .post(songsController.saveSong);

  app.route('/all')
  	.get(songsController.allSongs);

  app.route('/layers')
  	.post(songsController.getLayers);

  app.route('/savelayer')
  	.post(songsController.saveLayer);

  app.route('/newLayer')
  	.post(songsController.newLayer);
};
