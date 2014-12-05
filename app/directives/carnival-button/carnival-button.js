angular.module('carnival.directives')

.directive('carnivalCreateBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '@',
      style: '@',
      onClick: '&'
    },
    templateUrl: 'directives/carnival-button/carnival-button.html'
  };
});