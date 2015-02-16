angular.module('carnival.components.summarized-items', [])
.directive('carnivalSummarizedItems', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      parentEntity: '=',
      field: '=',
      datas: '=',
      state: '@',
      editable: '='
    },
    templateUrl: 'components/summarized-items/summarized-items.html',
    controller: function ($rootScope, $scope, $compile, utils, $element, FormService, Configuration, EntityResources) {
      $scope.openItems = function(){
        var nestedEntity = EntityResources.prepareForListState($scope.field.name, $scope.parentEntity);
        var listScope = $scope.$new();
        listScope.entity = nestedEntity;
        FormService.openColumnListing('list', '#form-columns', listScope);
      };
    }
  };
});
