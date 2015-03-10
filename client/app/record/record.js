angular.module('soundwich.record', [])

.controller('RecordController', function ($scope, $location, Songs) {
  $scope.ended = false;
  $scope.userTitles = [];

	var getUser = function(){
		Songs.getUser().then(function(){
			$scope.user = Songs.returnUser();	
		})
	};
	getUser();

  var getList = function(){
    Songs.findSongs().then(function(){
      $scope.userTitles = Songs.getTitles();
    });
  };
  getList();

  $scope.newsong = function(){
    var match = false;
    for (var i = 0; i < $scope.userTitles.length; i++){
      if ($scope.userTitles[i] === $scope.title){
        alert("This title has already been used! Please try another!");
        match = true;
      }
    }
    if (!match){
      Songs.recordSong($scope.user + "_" + $scope.title);
      var info = {};
      info.user = $scope.user;
      info.title = $scope.title;
      Songs.saveData(info); 
    }
  };

  $scope.logout = function(){
    Songs.logout();
  };


});
