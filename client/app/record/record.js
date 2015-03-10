angular.module('shortly.record', [])

.controller('RecordController', function ($scope, $location, Songs) {
  $scope.ended = false;
  $scope.userTitles = [];
	$scope.counter = 10;
	var getUser = function(){
		Songs.getUser().then(function(){
			$scope.user = Songs.returnUser();	
		})
	};
	getUser();

  $scope.newsong = function(){
  	Songs.recordSong($scope.user + "_" + $scope.title);
  	var info = {};
  	info.user = $scope.user;
  	info.title = $scope.title;
  	Songs.saveData(info);
  };


});
