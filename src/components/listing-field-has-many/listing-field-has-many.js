angular.module('carnival.components.listingfieldhasmany', [])
.directive('carnivalListingFieldHasMany', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-has-many/listing-field-has-many.html',
    controller: function ($scope, $stateParams, Configuration, urlParams) {
      var entity = Configuration.getEntity($stateParams.entity);
      
      var getRelationField = function(fields){
        for(var i = 0; i < fields.length; i++){
          var f = fields[i];
          if(f.type !== 'belongsTo' && f.type !== 'hasMany')
            continue;

          if(f.entityName === entity.name)
            return f;
        }
        return null;
      };
      $scope.getUrl = function () {
        var hasManyEntity = Configuration.getEntity($scope.field.entityName);
        var hasManyEntityField = getRelationField(hasManyEntity.fields);

        return '#/list/' + $scope.field.endpoint + '?page=1&search.' + hasManyEntityField.foreignKey + '=' + $scope.item[entity.identifier];
      };
    }
  };
});
