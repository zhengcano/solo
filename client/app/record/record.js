angular.module('shortly.record', [])

.controller('RecordController', function ($scope, $location, Songs) {
  $scope.song = {};
  $scope.ended = false;
  $scope.userTitles = [];

  $scope.newsong = function(title){

	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = ( navigator.getUserMedia ||
	                       navigator.webkitGetUserMedia ||
	                       navigator.mozGetUserMedia ||
	                       navigator.msGetUserMedia);

		var audioContext = new AudioContext();
		navigator.getUserMedia({audio: true}, function success(stream){
			var input = audioContext.createMediaStreamSource(stream);
			$scope.audio = document.querySelector('audio');
			$scope.audio.src = window.URL.createObjectURL(stream);

			var rec = new Recorder(input);
			rec.record();
			setTimeout(function(){
				if (!$scope.ended){
					rec.stop();
					rec.exportWAV(function(blob){
						Recorder.forceDownload(blob);
					});					
				}
			}, 10000);

		}, function(err){});

  };


});
