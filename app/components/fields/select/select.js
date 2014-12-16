angular.module('carnival.components.fields')
.directive('carnivalSelectField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      items: '=',
      editable: '='
    },
    templateUrl: 'components/fields/select/select.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});
