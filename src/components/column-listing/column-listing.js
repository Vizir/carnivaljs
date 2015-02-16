angular.module('carnival.components.column-listing', [])
.directive('carnivalColumnListing', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      entity: '=',
      field: '=',
      identifier: '='
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

      $scope.getListFields = function(){
        var fields = [];

        for(var i = 0; i < $scope.entity.fields.length; i++){
          var f = $scope.entity.fields[i];
          if(f.type !== 'belongsTo' && f.type !== 'hasMany')
            fields.push(f);
        }

        return fields;
      };
    }
  };
});
