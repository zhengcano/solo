angular.module('shortly.services', [])

.factory('Songs', function ($http) {
  var songs = {};
  var ended = false;
  var user;

  var getUser = function(){
    return $http({
      method: 'GET',
      url: '/api/users/getuser'
    })
    .then(function(resp){
      user = resp.data.username;
    })
  };

  var returnUser = function(){
    return user;
  }

  var findSongs = function() {
    return $http({
      method: 'GET',
      url: '/api/songs'
    })
    .then(function(resp){
      resp.data.forEach(function(song){
        songs[song.title] = song;
        songs[song.title].location = "audio/"+song.user+"_"+song.title+".wav"
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

  var saveSong = function(song, title){
    blobToBase64(song, function(base64){ // encode
      var update = {'blob': base64, 'title': title};
      console.log(update);
      $http({
        method: 'POST',
        url: '/api/songs/savesong',
        data: update})
        .then(function(new_recording) {
          console.log(new_recording);
        })
    });   
  };

  var getTitles = function(){
    var titleList = [];
    angular.forEach(songs, function(song){
      titleList.push(song.title)
    });

    return titleList;
  };

  var blobToBase64 = function(blob, cb) {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      cb(base64);
    };
    reader.readAsDataURL(blob);
  };


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

  var recordSong = function(title){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

    var audioContext = new AudioContext();
    navigator.getUserMedia({audio: true}, function success(stream){
      var input = audioContext.createMediaStreamSource(stream);

      var rec = new Recorder(input);
      rec.record();
      setTimeout(function(){
        if (!ended){
          rec.stop();
          rec.exportWAV(function(blob){
            // Recorder.forceDownload(blob);
            saveSong(blob, title);
          });         
        }
      }, 10000);

    }, function(err){});

  }


  return {
    findSongs: findSongs,
    getSongs: getSongs,
    saveSong: saveSong,
    getTitles: getTitles,
    saveData: saveData,
    recordSong: recordSong,
    getUser: getUser,
    returnUser: returnUser
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
