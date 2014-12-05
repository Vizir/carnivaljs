angular.module('carnival.components.hasmanyfield', [])
.directive('carnivalHasmanyField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      relation: '='
    },
    templateUrl: 'components/hasmany-field/hasmany-field.html'
  };
});
