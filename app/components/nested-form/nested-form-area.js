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
    controller: function ($rootScope, $scope, utils, $element,  $compile, FormService, Configuration) {

      $scope.canOpenNestedForm = function(){
        if(!$scope.entity.nestedForms[$scope.field.endpoint])
          return false;

        if($scope.state === 'create')
          return false;

        return true;
      };

      var openNestedForm = function(){

      };

      $scope.openWithData = function(data){
        $scope.entity.nestedForms[$scope.field.endpoint].datas = data;
        if(FormService.isNestedOpen($scope.field.entityName)){
          return;
        }
        var state = 'create';
        if(Object.keys(data).length > 0)
          state = 'edit';
        FormService.openNested($scope.field.entityName);
        var directive = '<carnival-nested-form state="'+state+'" type="nested" entity="entity.nestedForms[field.endpoint]"></carnival-nested-form></div>';
        var newElement = $compile(directive)($scope);
        var nestedDiv = document.querySelector('#nesteds_'+$scope.field.entityName);
        angular.element(nestedDiv).append(newElement);
      };

      $scope.open = function(){
        $scope.openWithData({});
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
