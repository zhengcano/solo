(function(angular){

  angular.module('shortly')
    .directive('shortenedLink', function(Songs){
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/songtemplate.html'
      };
    });

})(window.angular);
