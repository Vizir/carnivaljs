angular.module('carnival')
.controller('MainController', function ($scope, Configuration) {

  var app_name = $scope.app_name = Configuration.getAppName(),
      menu_items = $scope.menu_items = [],
      entities = Configuration.getEntities();

  $scope.relatedResources = {};

  var getRelatedResources = function(resourceName){
    var belongsToField = Configuration.getEntity(resourceName);
    belongsToField.getList().success(function (data, status, headers, config) {
        $scope.relatedResources[resourceName] = data;
      });
  };

  var hasRelatedResources = function(state, type){
    return (state === 'edit' || state === 'create') && type == 'belongsTo';
  };

  $scope.buildFieldsForState = function(args){
    var entity = args.entity;
    for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
      var field = entity.model.fields[i];
      if (field.type === 'hasMany')
        continue;
      if (entity.model.checkFieldView(field.name, args.state)) {
        entity.fields.unshift(field);
        if(hasRelatedResources(args.state, field.type)){
          getRelatedResources(field.resourceName);
        }
      }
    }
  };

  for (var i = 0, x = entities.length; i < x; i += 1) {
    menu_items.push({
      name: entities[i].name,
      label: entities[i].label
    });
  }

});
