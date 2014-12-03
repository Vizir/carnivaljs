angular.module('carnival.directives')
.directive('carnivalBelongstoField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      relation: '='
    },
    link: function (scope) {
      console.log(scope.relation);
    },
    templateUrl: 'directives/belongsto-field/belongsto-field.html'
  };
});