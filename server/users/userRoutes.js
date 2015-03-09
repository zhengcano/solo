var userController = require('./userController.js');


module.exports = function (app) {
  // app === userRouter injected from middleware.js

  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.get('/signedin', userController.checkAuth);
  // app.get('/logout', userController.logout);
};
