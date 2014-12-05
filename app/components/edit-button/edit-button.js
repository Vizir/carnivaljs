angular.module('carnival.directives')
.directive('carnivalEditBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entityName: '=',
      id: '=',
      size: '='
    },
    templateUrl: 'components/edit-button/edit-button.html'
  };
});