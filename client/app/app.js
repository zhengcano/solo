angular.module('soundwich', [
  'soundwich.services',
  'soundwich.songs',
  'soundwich.record',
  'soundwich.auth',
  'soundwich.mysongs',
  'soundwich.layers',
  'ui.router'
])
.config(function($stateProvider, $httpProvider) {
  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController',
      authenticate: false
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController',
      authenticate: false
    })
    .state('record', {
      url: '/record',
      templateUrl: 'app/record/record.html',
      controller: 'RecordController',
      authenticate: true
    })
    .state('mysongs', {
      url: '/mysongs',
      templateUrl: 'app/songs/songs.html',
      controller: 'MySongsController',
      authenticate: true
    })
    .state('songs', {
      url: '/songs',
      templateUrl: 'app/songs/songs.html',
      controller: 'SongsController',
      authenticate: true
    })
    .state('layers', {
      url: '/layers',
      templateUrl: 'app/layers/layers.html',
      controller: 'LayersController',
      authenticate: true
    })
    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
})
.config(function($urlRouterProvider){
  $urlRouterProvider.otherwise('/songs');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.soundwich');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$stateChangeStart', function (evt, toState, current) {
    if ( !toState.authenticate && Auth.isAuth()) {
      $location.path('/songs');
    } else if (toState.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
