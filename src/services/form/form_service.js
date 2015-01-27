angular.module('carnival')
.service('FormService', function (Configuration, ActionFactory) {
  this.nesteds = {};
  this.init = function(entity){
    this.entity = entity;
    this.nesteds = {};
  };

  this.openNested = function(formId){
    if(!this.nesteds[formId])
        this.nesteds[formId] = {};

    var nestedForms = this.nesteds[formId];
    nestedForms.saved = false;
  };

  this.saveNested = function(formId){
    var nestedForms = this.nesteds[formId];
    nestedForms.saved = true;
  };

  this.hasUnsavedNested = function(){
    for(var key in this.nesteds){
      var nestedForm = this.nesteds[key];
      if(!nestedForm.saved)
        return true;
    }
    return false;
  };

  this.isNestedOpen = function(formId){
    if(!this.nesteds[formId])
      return false;
    return true;
  };

  this.closeNested = function(formId){
    delete this.nesteds[formId];
  };

  var isARelation = function(field){
    if(field.type != 'hasMany' && field.type != 'belongsTo')
      return false;
    return true;
  };

  this.canShowThisField = function(formEntity, state, field){
    if(!isARelation(field))
      return true;

    if(formEntity.parentEntity){
      if(formEntity.parentEntity.name === field.entityName)
          return false;
    }

    if(state === 'create' && field.type === 'hasMany'){
      return this.canShowThisHasManyField(formEntity, state, field);
    }
    return true;
  };

  this.canShowThisHasManyField = function(formEntity, state, field){
    var fieldEntity = Configuration.getEntity(field.entityName);
    var relationField = fieldEntity.getFieldByEntityName(formEntity.name);
    if(relationField.type === 'belongsTo' && !field.views[state].showOptions)
      return false;

    return true;
  };
});

