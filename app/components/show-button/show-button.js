angular.module('carnival.directives')
.directive('carnivalShowBtn', function () {
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