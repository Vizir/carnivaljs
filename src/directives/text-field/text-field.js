angular.module('carnival.directives')
.directive('carnivalTextField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      editable: '=',
      placeHolder: '=',
      model: '='
    },
    templateUrl: 'directives/text-field/text-field.html',
    link: function (scope, element, attrs) {
      element['0'].disabled = scope.editable ? false : true;
    }
  };
});