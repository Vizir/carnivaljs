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
    controller: function ($rootScope, $scope, utils, Configuration, $compile, $element, $document, $filter) {
      $scope.utils = utils;

      $scope.showOptions = function(){
        var fieldEntity = Configuration.getEntity($scope.field.entityName);
        var relationField = fieldEntity.getFieldByEntityName($scope.parentEntity.name);
        if(relationField.type === 'belongsTo' && !$scope.field.views[$scope.state].showOptions)
          return false;

        return true;
      };

      $scope.showAs = function(){
        return $scope.field.views[$scope.state].nested.showItemsAs;
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

      var deleteIfNeeded = function(id){
        if($scope.field.views[$scope.state].enableDelete){
          var fieldEntity = Configuration.getEntity($scope.field.entityName);
          fieldEntity.delete(id)
          .success(function () {
            var message = $filter('translate')('DELETED_SUCCESS_MESSAGE');
            new Notification(message, 'warning');
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
