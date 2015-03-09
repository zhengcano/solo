angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $location, Links) {
  $scope.link = {};

  $scope.newlink = function() {
    Links.saveUrl($scope.link).then(function(link){
      $scope.createdLink = link;
    });
  };

});
