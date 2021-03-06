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

      var init = function(){
        $scope.utils = utils;
      };

      $scope.hasNested = function(){
        var viewProp = $scope.field.views[$scope.state];
        return (viewProp && viewProp.nested);
      };

      $scope.showOptions = function(){
        var fieldEntity = Configuration.getEntity($scope.field.entityName);
        var relationField = fieldEntity.getFieldByEntityName($scope.parentEntity.name);
        if(relationField && relationField.type === 'belongsTo' && !$scope.field.views[$scope.state].showOptions)
          return false;

        return true;
      };

      $scope.showAs = function(){
        return $scope.field.showAs;
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

      init();
    }
  };
});
