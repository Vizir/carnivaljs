angular.module('carnival')
.service('EntityResources', function (Configuration, ActionFactory) {

  var getNestedForm = function(entity, stateName, field){
    if(!field.views[stateName].nested)
       return;
    
    entity.nestedForms[field.resourceName] = prepareEntityForState(field.resourceName, stateName, field);
  };

  var getRelatedResources = function(entity, resourceName){
    var belongsToField = Configuration.getEntity(resourceName);
    belongsToField.getList().success(
      function (data, status, headers, config) {
        entity.relatedResources[resourceName] = data;
      });
  };

  var hasRelatedResources = function(state, type){
    return (state === 'edit' || state === 'create' || state === 'index') && type === 'belongsTo';
  };

  var prepareField = function(entityWrapper, stateName, field, isField){
    if (entityWrapper.model.checkFieldView(field.name, stateName)) {
      entityWrapper.fields.unshift(field);
      if(hasRelatedResources(stateName, field.type)){
        getRelatedResources(entityWrapper, field.resourceName);
        if(!isField && stateName === 'edit' )
          getNestedForm(entityWrapper, stateName, field);
      }
    }
  };

  var prepareFields = function(entityWrapper, stateName, isField){
    entityWrapper.relatedResources = {};
    for (var i = entityWrapper.model.fields.length - 1; i >= 0; i -= 1) {
      var field = entityWrapper.model.fields[i];
      prepareField(entityWrapper, stateName, field, isField);
    }
  };

  var prepareActions = function(entityWrapper, stateName){
    var actionObj =  ActionFactory.buildAction(entityWrapper, stateName);
    entityWrapper[actionObj.name] = actionObj.value;
  };

  var prepareEntityForState = function(entityName, stateName, isField){
    var entityWrapper = {};
    entityWrapper.nestedForms = {};
    entityWrapper.model = Configuration.getEntity(entityName);
    entityWrapper.name = entityWrapper.model.name;
    entityWrapper.label = entityWrapper.model.label;
    entityWrapper.identifier = entityWrapper.model.identifier;
    entityWrapper.fields = [];
    entityWrapper.datas = [];
    prepareFields(entityWrapper, stateName, isField);
    prepareActions(entityWrapper, stateName);
    return entityWrapper;
  };

  this.prepareForState = function(entityName, stateName, isField){
    return prepareEntityForState(entityName, stateName, isField);
  };

  this.prepareForCreateState = function(entityName){
    return this.prepareForState(entityName, 'create'); 
  };

  this.prepareForEditState = function(entityName){
    return this.prepareForState(entityName, 'edit'); 
  };

  this.prepareForShowState = function(entityName){
    return this.prepareForState(entityName, 'show'); 
  };

  this.prepareForListState = function(entityName){
    return this.prepareForState(entityName, 'index'); 
  };
});
