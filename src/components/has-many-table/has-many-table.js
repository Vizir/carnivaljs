angular.module('carnival.components.has-many-table', [])
.directive('carnivalHasManyTable', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      parentEntity: '=',
      field: '=',
      datas: '=',
      hasNested: '=',
      state: '@',
      editable: '='
    },
    templateUrl: 'components/has-many-table/has-many-table.html',
    controller: function ($rootScope, $scope, $compile, utils, $element, FormService, Configuration, EntityResources) {

      $scope.getListFields = function(){
        var fields = [];

        for(var i = 0; i < $scope.entity.fields.length; i++){
          var f = $scope.entity.fields[i];
          if(f.type !== 'belongsTo' && f.type !== 'hasMany')
            fields.push(f);
        }

        return fields;
      };

      var init = function(){
        $scope.entity = EntityResources.prepareForListState($scope.field.name, $scope.parentEntity);
      };

      init();
    }
  };
});
