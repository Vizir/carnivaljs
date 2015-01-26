angular.module('carnival.components.fields.number', [])
.directive('carnivalNumberField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/number/number.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});
