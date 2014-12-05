angular.module('carnival.directives')
.directive('carnivalForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      action: '='
    },
    templateUrl: 'components/carnival-form/carnival-form.html'
  };
});