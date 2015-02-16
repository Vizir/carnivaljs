angular.module('carnival.components.summarized-items', [])
.directive('carnivalSummarizedItems', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      field: '=',
      state: '@',
      editable: '='
    },
    templateUrl: 'components/summarized-items/summarized-items.html',
    controller: function ($rootScope, $scope, $compile, utils, $element, FormService, Configuration, EntityResources) {
      $scope.openItems = function(){
        $scope.nestedEntity = EntityResources.prepareForListState($scope.field.name);
        FormService.openColumnListing('list', '#form-columns', $scope);
      };
    }
  };
});
