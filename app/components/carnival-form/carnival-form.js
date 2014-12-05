angular.module('carnival.directives')
.directive('carnivalForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      action: '=',
      datas: '='
    },
    templateUrl: 'components/carnival-form/carnival-form.html'
  };
});