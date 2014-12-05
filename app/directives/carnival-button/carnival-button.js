angular.module('carnival.directives')
.directive('carnivalButton', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      style: '@',
      size: '@'
    },
    templateUrl: 'directives/carnival-button/carnival-button.html'
  };
});