angular.module('carnival.directives')
.directive('carnivalEditBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entityName: '=',
      id: '='
    },
    templateUrl: 'directives/edit-button/edit-button.html'
  };
});