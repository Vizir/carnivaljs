angular.module('carnival.components.form', [])
.directive('carnivalForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      action: '='
    },
    templateUrl: 'components/form/carnival-form.html'
  };
});
