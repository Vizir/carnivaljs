angular.module('carnival.components.fields.hasMany', [])
.directive('carnivalHasManyField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      state: '@',
      parentEntity: '=',
      relatedResources: '='
    },
    templateUrl: 'components/fields/has-many/has-many.html',
    controller: function ($rootScope, $scope, utils, Configuration, $compile, $element, $document, FormService) {
      $scope.utils = utils;

      $scope.showOptions = function(){
        var fieldEntity = Configuration.getEntity($scope.field.entityName);
        var relationField = fieldEntity.getFieldByEntityName($scope.parentEntity.name);
        if(relationField.type === 'belongsTo' && !$scope.field.views[$scope.state].showOptions)
          return false;

        return true;
      };

      var getItemIndex = function(id, items){
        for(var i = 0; i < items.length; i++){
          if(items[i].id === id)
            return i;
        }
        return -1;
      };

      var getSelectedItem = function(){
        var items = $scope.relatedResources;
        var index = getItemIndex($scope.selectedHasMany, items);
        if(index >= 0)
          return items[index];
      };

      $scope.addHasManyOption = function(){
        var selectedItem = getSelectedItem();
        if(!$scope.datas)
          $scope.datas = [];
        if(selectedItem)
          $scope.datas.push(selectedItem);
      };
    }
  };
});
