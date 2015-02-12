angular.module('carnival.components.fields.number', [])
.directive('carnivalNumberField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '='
    },
    templateUrl: 'components/fields/number/number.html'
  };
});
