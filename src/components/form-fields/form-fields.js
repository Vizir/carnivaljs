angular.module('carnival.components.form-fields', [])
.directive('carnivalFormFields', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'components/form-fields/form-fields.html'
  };
});
