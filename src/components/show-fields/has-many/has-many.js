angular.module('carnival.components.showHasMany', [])
.directive('carnivalShowHasMany', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/show-fields/has-many/has-many.html'
  };
});
