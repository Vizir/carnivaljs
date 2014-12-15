angular.module('carnival.components.listingfield', [])
.directive('carnivalListingField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field/listing-field.html',
    controller: function($scope, $stateParams, Configuration){
      var entityModel = Configuration.getEntity($stateParams.entity);
        
      $scope.getHtml = function(){
        if($scope.field.type != 'belongsTo' && $scope.field.type != 'hasMany'){
          return $scope.item[$scope.field.name]
        }else if($scope.field.type != 'belongsTo'){
           
        }
      }
    }
  };
});
