angular.module('carnival.components.fields.select', [])
.directive('carnivalSelectField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      items: '=',
      resourceLabel: '=',
      resourceIdentifier: '=',
      editable: '='
    },
    templateUrl: 'components/fields/select/select.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    },
    controller: function ($rootScope, $scope, utils) {
      $scope.utils = utils;
    }
  };
});
