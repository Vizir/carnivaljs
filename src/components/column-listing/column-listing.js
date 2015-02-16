angular.module('carnival.components.column-listing', [])
.directive('carnivalColumnListing', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      datas: '=',
      actions: '=',
      extraActions: '=',
      parentEntity: '=',
      identifier: '=',
      entityName: '='
    },
    templateUrl: 'components/column-listing/column-listing.html',
    controller: function($scope, FormService, Configuration, EntityResources){

      $scope.cssClass = 'fadeInRight';
      $scope.style = {
        zIndex: (FormService.columnsCount() * 10) + 2,
        left: (FormService.columnsCount() * 20) + 'px',
        top: (FormService.columnsCount() * 30) + 'px',
        padding: '10px'
      };

      $scope.create = function(){
        var formScope = $scope.$new();
        formScope.entity = EntityResources.prepareForCreateState($scope.entityName, $scope.parentEntity);
        FormService.openColumn('create', '#form-columns', formScope);
      };

      $scope.edit = function(data){
        $scope.field = {
          entityName: $scope.entityName
        };
        var formScope = $scope.$new();
        formScope.entity = EntityResources.prepareForCreateState($scope.entityName, $scope.parentEntity);
        formScope.entity.datas = data;
        FormService.openColumn('edit', '#form-columns', formScope);
      };

      $scope.getListFields = function(){
        var fields = [];

        for(var i = 0; i < $scope.fields.length; i++){
          var f = $scope.fields[i];
          if(f.type !== 'belongsTo' && f.type !== 'hasMany')
            fields.push(f);
        }

        return fields;
      };
    }
  };
});
