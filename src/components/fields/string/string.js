angular.module('carnival.components.fields.string', [])
.directive('carnivalStringField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '='
    },
    templateUrl: 'components/fields/string/string.html'
  };
});
