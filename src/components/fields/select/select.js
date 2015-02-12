angular.module('carnival.components.fields.select', [])
.directive('carnivalSelectField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      items: '=',
      field: '=',
      identifier: '='
    },
    templateUrl: 'components/fields/select/select.html',
    controller: function ($rootScope, $scope, utils) {
      $scope.utils = utils;
    }
  };
});
