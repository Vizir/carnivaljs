angular.module('carnival.components.fields.text', [])
.directive('carnivalTextField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '='
    },
    templateUrl: 'components/fields/text/text.html'
  };
});
