(function(angular){

  angular.module('shortly')
    .directive('shortenedLink', function(Links){
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/linktemplate.html'
      };
    });

})(window.angular);
