angular.module('soundwich.mysongs', [])

.controller('MySongsController',['$scope', 'Songs', function ($scope, Songs) {
	var findSongs = function(){
		Songs.findSongs().then(function(){
			$scope.songs = Songs.getSongs();
		});
	};
	findSongs();

	$scope.logout = function(){
		Songs.logout();
	};

}]);