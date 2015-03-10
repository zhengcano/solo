angular.module('shortly.services', [])

.factory('Songs', function ($http) {
  var songs = {};

  var findSongs = function() {
    return $http({
      method: 'GET',
      url: '/api/songs'
    })
    .then(function(resp){
      resp.data.forEach(function(song){
        songs[song.title] = song;
      });
    });
  };

  var getSongs = function(){
    var songList = [];

    angular.forEach(songs, function(song){
      songList.push(song);
    });

    return songList;
  };

  var getTitles = function(){
    var titleList = [];
    angular.forEach(songs, function(song){
      titleList.push(song.title)
    });

    return titleList;
  }

  var saveSong = function(song, title){
    var blobToBase64 = function(blob, cb) {
      var reader = new FileReader();
      reader.onload = function() {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        cb(base64);
      };
      reader.readAsDataURL(blob);
    };

    blobToBase64(song, function(base64){ // encode
      var update = {'blob': base64, 'title': title};
      $http.post('/api/songs/save', update)
        .success(function(new_recording) {
          console.log("success");
        }
      })
    })  
  }

  var saveData = function(data){
    
    return $http({
      method: 'POST',
      url: '/api/songs',
      data: data
    })
    .then(function(resp){
      return resp.data;
    });
  };


  return {
    findSongs: findSongs,
    getSongs: getSongs,
    saveUrl: saveUrl
  };

})

.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.shortly');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.shortly');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
