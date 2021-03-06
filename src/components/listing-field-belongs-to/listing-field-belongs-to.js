angular.module('carnival.components.listingfieldbelongsto', [])
.directive('carnivalListingFieldBelongsTo', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-belongs-to/listing-field-belongs-to.html',
    controller: function($scope, $stateParams, Configuration){
      var entityModel = Configuration.getEntity($stateParams.entity);

      $scope.getUrl = function(){
        var fieldUrl = $scope.item[$scope.field.name + 'Url'];
        if(!fieldUrl)
          fieldUrl = '#/show/' + $scope.field.endpoint + '/' + $scope.item[$scope.field.name].id;
        return fieldUrl;
      };

      $scope.getLabel = function(){
        return $scope.item[$scope.field.name][$scope.field.field];
      };
    }
  };
});
