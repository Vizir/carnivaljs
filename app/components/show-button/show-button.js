angular.module('carnival.components.showbutton', [])
.directive('carnivalShowButton', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entityName: '=',
      id: '='
    },
    templateUrl: 'components/show-button/show-button.html'
  };
});
