angular.module('carnival.directives')
.directive('carnivalHasmanyField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      relation: '='
    },
    link: function (scope) {
      console.log(scope.relation);
    },
    templateUrl: 'directives/hasmany-field/hasmany-field.html'
  };
});