angular.module('carnival.components.button', [])
.directive('carnivalButton', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '@',
      style: '@',
      size: '@'
    },
    templateUrl: 'components/button/button.html'
  };
});
