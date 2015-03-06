angular.module('carnival.components.showEnum', [])
.directive('carnivalShowEnum', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/show-fields/enum/enum.html',
    link: function (scope) {
      scope.getValue = function (item) {
        for (var i = 0, x = scope.field.values.length; i < x; i += 1) {
          if (scope.field.values[i].value === item) {
            return scope.field.values[i].label;
          }
        }
      };
    }
  };
});
