angular.module('carnival')
.service('EntityResources', function (Configuration) {

  var getRelatedResources = function(entity, resourceName){
    var belongsToField = Configuration.getEntity(resourceName);
    belongsToField.getList().success(
      function (data, status, headers, config) {
        entity.relatedResources[resourceName] = data;
      });
  };

  var hasRelatedResources = function(state, type){
    return (state === 'edit' || state === 'create' || state === 'index') && (type === 'belongsTo' || type === 'hasMany');
  };

  var prepareFields = function(entityWrapper, stateName){
    entityWrapper.relatedResources = {};
    for (var i = entityWrapper.model.fields.length - 1; i >= 0; i -= 1) {
      var field = entityWrapper.model.fields[i];
      if (entityWrapper.model.checkFieldView(field.name, stateName)) {
        entityWrapper.fields.unshift(field);
        if(hasRelatedResources(stateName, field.type)){
          getRelatedResources(entityWrapper, field.resourceName);
        }
      }
    }
  };

  this.prepareForState = function(entityWrapper, entityName,  stateName){
    entityWrapper.model = Configuration.getEntity(entityName);
    entityWrapper.name = entityWrapper.model.name;
    entityWrapper.label = entityWrapper.model.label;
    entityWrapper.identifier = entityWrapper.model.identifier;
    entityWrapper.fields = [];
    entityWrapper.datas = [];
    prepareFields(entityWrapper, stateName);
  };

  this.prepareForCreateState = function(resource, entityName){
    this.prepareForState(resource, entityName, 'create');
  };

  this.prepareForEditState = function(resource, entityName){
    this.prepareForState(resource, entityName, 'edit');
  };

  this.prepareForShowState = function(resource, entityName){
    this.prepareForState(resource, entityName, 'show');
  };

  this.prepareForListState = function(resource, entityName){
    this.prepareForState(resource, entityName, 'index');
  };
});
