angular.module('shortly.songs', [])

.controller('SongsController',['$scope', 'Songs', function ($scope, Songs) {
	var findSongs = function(){
		Songs.findSongs().then(function(){
			$scope.songs = Songs.getSongs();
		});
	};
	findSongs();

}]);
