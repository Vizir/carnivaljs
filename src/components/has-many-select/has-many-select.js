angular.module('carnival.components.has-many-select', [])
.directive('carnivalHasManySelect', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      parentEntity: '=',
      relatedResources: '='
    },
    templateUrl: 'components/has-many-select/has-many-select.html',
    controller: function ($rootScope, $scope, utils, Configuration) {
      var init = function(){
        if(!$scope.datas)
          $scope.datas = [];
      };

      var isInDatas = function(item){
        var fieldEntity = Configuration.getEntity($scope.field.entityName);
        var identifier = fieldEntity.identifier;
        for(var i = 0; i < $scope.datas.length; i++){
          var data = $scope.datas[i];
          if(item[identifier] === data[identifier])
            return true;
        }
        return false;
      };

      $scope.getAvailableResources = function(){
        var resources = [];
        if(!$scope.relatedResources)
          return resources;
        for(var i = 0; i < $scope.relatedResources.length; i++){
          var resource = $scope.relatedResources[i];
          if(!isInDatas(resource))
            resources.push(resource);
        }
        return resources;
      };

      var getSelectedItem = function(){
        var items = $scope.getAvailableResources();
        var index = $scope.selectedHasMany;
        if(index >= 0)
          return items[index];
      };

      $scope.addHasManyOption = function(){
        var selectedItem = getSelectedItem();

        if(selectedItem){
          $scope.datas.push(selectedItem);
        }
      };

      init();

    }
  };
});
