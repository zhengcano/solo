angular.module('soundwich.layers', [])

.controller('LayersController', function ($scope, $location, Songs) {
  $scope.ended = false;
  $scope.song;
  $scope.layers = [];

	var getUser = function(){
		Songs.getUser().then(function(){
			$scope.user = Songs.returnUser();
		})
	};
	getUser();

  var getList = function(){
    Songs.findAll();
  };
  getList();

  $scope.findTrack = function(){
    $scope.song = Songs.getTrack($scope.title);
    Songs.getLayers($scope.song.title, $scope.song.user).then(function(){
      $scope.layers = Songs.returnLayers();
      console.log($scope.layers);
    });
  };

  $scope.recNewLayer = function(){
    var base = document.getElementById('master');
    Songs.recordLayer($scope.user + "_" + $scope.title + "_" + $scope.layertitle, base);
    var info = {};
    info.user = $scope.user;
    info.song = $scope.title;
    info.title = $scope.layertitle;
    Songs.saveLayerData(info); 
  }

  $scope.play = function(){
    console.log('hi');
    var audios = document.getElementsByTagName('audio');
    for (var i = 0; i < audios.length; i++){
      audios[i].play();
    }
  }

  $scope.logout = function(){
    Songs.logout();
  };


});