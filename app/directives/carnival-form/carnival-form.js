angular.module('carnival.directives')
.directive('carnivalForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      action: '@'
    },
    templateUrl: 'directives/carnival-form/carnival-form.html'
  };
});