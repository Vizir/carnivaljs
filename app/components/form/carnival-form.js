angular.module('carnival.components.form', [])
.directive('carnivalForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      action: '=',
      datas: '='
    },
    templateUrl: 'components/form/carnival-form.html'
  };
});
