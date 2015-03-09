angular.module('shortly.links', [])

.controller('LinksController',['$scope', 'Links', function ($scope, Links) {
  var findLinks = function(){
    Links.findLinks().then(function(){
      $scope.links = Links.getLinks();
    });
  };
  findLinks();


}]);
