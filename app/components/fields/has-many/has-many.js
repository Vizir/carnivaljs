angular.module('carnival.components.fields.hasMany', [])
.directive('carnivalHasManyField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      state: '@state',
      entity: '=',
      nestedFormIndex: '=',
      relatedResources: '=',
      editable: '='
    },
    templateUrl: 'components/fields/has-many/has-many.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    },
    controller: function ($rootScope, $scope, utils, Configuration) {
      $scope.utils = utils;

      $scope.open = function(index){
        $scope.entity.nestedForms[$scope.field.endpoint].opened = true;
      };

      $scope.canOpenNestedForm = function(){
        if(!$scope.entity.nestedForms[$scope.field.name])
          return false;

        if($scope.state === 'create')
          return false;

        return true;
      };

      $scope.canShow = function(){
        var fieldEntity = Configuration.getEntity($scope.field.entityName);
        var f = fieldEntity.getFieldByEntityName($scope.entity.name);
        if(f === null)
          return true;

        if(f.type === 'belongsTo' && f.required)
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
        var items = $scope.relatedResources[$scope.field.name];
        var index = getItemIndex($scope.selectedHasMany, items);
        if(index >= 0)
          return items[index];
      };

      $scope.addHasManyOption = function(){
        var selectedItem = getSelectedItem();
        if(!$scope.datas[$scope.field.name])
          $scope.datas[$scope.field.name] = [];
        if(selectedItem){
          $scope.datas[$scope.field.name].push(selectedItem);
        }
      };

      $scope.remove = function(id){
        var items = $scope.datas[$scope.field.name];
        var index = getItemIndex(id, items);
        if(index < 0)
          return;
        items.splice(index, 1);
      };
    }
  };
});
