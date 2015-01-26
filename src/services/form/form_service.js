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
});

