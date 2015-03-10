angular.module('soundwich.songs', [])

.controller('SongsController',['$scope', 'Songs', function ($scope, Songs) {
	var findSongs = function(){
		Songs.findAll().then(function(){
			$scope.songs = Songs.getSongs();
		});
	};
	findSongs();

	$scope.logout = function(){
		Songs.logout();
	};

}]);
