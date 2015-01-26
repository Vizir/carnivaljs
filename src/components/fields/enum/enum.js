angular.module('carnival.components.fields.enum', [])
.directive('carnivalEnumField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/fields/enum/enum.html'
  };
});
