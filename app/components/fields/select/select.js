angular.module('carnival.components.fields')
.directive('carnivalSelectField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '=',
      relatedResources: '=',
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
