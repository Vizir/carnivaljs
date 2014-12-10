angular.module('carnival.components.fields')
.directive('carnivalTextField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/text/text.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});
