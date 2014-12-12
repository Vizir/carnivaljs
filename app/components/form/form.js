angular.module('carnival.components.form', [])
.directive('carnivalForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      action: '=',
      datas: '=',
      editable: '='
    },
    templateUrl: 'components/form/form.html'
  };
});
