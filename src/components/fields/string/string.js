angular.module('carnival.components.fields.string', [])
.directive('carnivalStringField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/string/string.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});
