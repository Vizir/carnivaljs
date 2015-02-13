angular.module('carnival.components.summarized-items', [])
.directive('carnivalSummarizedItems', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entities: '=',
      field: '=',
      state: '@',
      editable: '='
    },
    templateUrl: 'components/summarized-items/summarized-items.html',
    controller: function ($rootScope, $scope, utils, $element, FormService, Configuration) {
      $scope.entity = Configuration.getEntity($scope.field.entityName);
      $scope.teste = $scope.entities;
    }
  };
});
