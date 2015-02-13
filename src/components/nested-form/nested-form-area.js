angular.module('carnival.components.nested-form-area', [])
.directive('carnivalNestedFormArea', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      field: '=',
      state: '@',
      datas: '=',
      relationType: '@',
      editable: '='
    },
    templateUrl: 'components/nested-form/nested-form-area.html',
    controller: function ($rootScope, $scope, $timeout, utils, $element,  $compile, FormService, Configuration, EntityResources, Notification) {

      $scope.canOpenNestedForm = function(){
        if(!$scope.entity.nestedForms[$scope.field.endpoint])
          return false;

        if($scope.state === 'create')
          return false;

        return true;
      };

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
      }

      $scope._openForm = function(nestedEntity, data, state){
        var nestedType = $scope.field.views[state].nested;
        var containerId = getContainerId(state, data);
        nestedEntity.parentEntity = $scope.entity;
        nestedEntity.datas = data;
        $scope.nestedEntity = nestedEntity;
        if(nestedType.type === 'column'){
          FormService.openColumnNested(state, containerId, $scope);
        }else{
          FormService.openSimpleNested(state, containerId, $scope);
        }
      };

      $scope.showAs = function(){
        return $scope.field.views[$scope.state].nested.showItemsAs;
      };

      $scope.openWithData = function(data){
        var state = 'edit';
        var nestedEntity = EntityResources.prepareForEditState($scope.field.entityName);
        var identifier = nestedEntity.identifier;
        nestedEntity[identifier] = data[identifier];
        $scope._openForm(nestedEntity, data, 'edit');
      };

      $scope.open = function(){
        var state = 'create';
        var nestedEntity = $scope.entity.nestedForms[$scope.field.endpoint];
        $scope._openForm(nestedEntity, {}, 'create');
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
        var items = $scope.datas[$scope.field.name];
        var index = getItemIndex(id, items);
        if(index < 0)
          return;
        items.splice(index, 1);

        deleteIfNeeded(id);
      };
    }
  };
});
