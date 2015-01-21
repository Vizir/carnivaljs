angular.module('carnival.components.fields.boolean', [])
.directive('carnivalBooleanField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/boolean/boolean.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});
