angular.module('carnival.components.relation-field-area', [])
.directive('carnivalRelationFieldArea', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      parentEntity: '=',
      field: '=',
      state: '@',
      datas: '=',
      relationType: '@',
      editable: '='
    },
    templateUrl: 'components/relation-field-area/relation-field-area.html',
    controller: function ($rootScope, $scope, $timeout, utils, $element,  $compile, FormService, Configuration, EntityResources, Notification) {

      var getContainerId = function(state, data){
        var nestedType = $scope.field.views[state].nested;
        if(nestedType.type === 'column'){
          return '#form-columns';
        }else{
          var prefix = '';
          if(state === 'edit' )
            prefix = '_' + data[$scope.field.identifier];
          return '#'+state+'_nested_'+ $scope.field.entityName +  prefix;
        }
      };

      $scope.showAs = function(){
        return $scope.field.views[$scope.state].nested.showItemsAs;
      };

      $scope.isHasMany = function(){
        return $scope.relationType === 'hasMany';
      };

      var getItemIndex = function(id, items){
        for(var i = 0; i < items.length; i++){
          if(items[i].id === id)
            return i;
        }
        return -1;
      };

      var deleteIfNeeded = function(id){
        if($scope.field.views[$scope.state].enableDelete){
          var fieldEntity = Configuration.getEntity($scope.field.entityName);
          fieldEntity.delete(id)
          .success(function () {
            new Notification('Item deleted with success!', 'warning');
          })
          .error(function (data) {
            new Notification(data, 'danger');
          });
        }
      };

      $scope.remove = function(id){
        var items = $scope.datas;
        var index = getItemIndex(id, items);
        if(index < 0)
          return;
        items.splice(index, 1);

        deleteIfNeeded(id);
      };
    }
  };
});
