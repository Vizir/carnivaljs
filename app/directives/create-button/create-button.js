angular.module('carnival.directives')

.directive('carnivalCreateBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entityName: '='
    },
    templateUrl: 'directives/create-button/create-button.html'
  };
});