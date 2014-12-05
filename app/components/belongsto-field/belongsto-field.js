angular.module('carnival.directives')
.directive('carnivalBelongstoField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      relation: '='
    },
    templateUrl: 'components/belongsto-field/belongsto-field.html'
  };
});
