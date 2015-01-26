angular.module('carnival.components.fields.date', [])
.directive('carnivalDateField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/date/date.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});
