angular.module('carnival.components.fields.hasMany', [])
.directive('carnivalHasManyField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      entity: '=',
      nestedFormType: '=',
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
    controller: function ($rootScope, $scope, utils) {
      $scope.utils = utils;

      $scope.open = function(index){
        $rootScope["nested_form_"+ $scope.entity.model.name + "_" + index + "_opened"] = true;
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
        if(selectedItem)
          $scope.datas[$scope.field.name].push(selectedItem);
      };

      $scope.remove = function(id){
        var items = $scope.datas[$scope.field.name];
        var index = getItemIndex(id, items);
        if(!index)
          return;
        items.splice(index, 1);

      };
    }
  };
});
