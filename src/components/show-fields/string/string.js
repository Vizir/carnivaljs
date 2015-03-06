angular.module('carnival.components.showString', [])
.directive('carnivalShowString', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/string/string.html'
  };
});
