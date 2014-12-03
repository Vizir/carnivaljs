angular.module('carnival.directives')
.directive('carnivalShowBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entityName: '=',
      id: '='
    },
    templateUrl: 'directives/show-button/show-button.html'
  };
});