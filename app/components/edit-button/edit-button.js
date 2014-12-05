angular.module('carnival.components.edit-button', [])
.directive('carnivalEditButton', function () {
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
