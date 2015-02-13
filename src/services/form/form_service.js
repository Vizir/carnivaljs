angular.module('carnival')
.service('FormService', function (Configuration, ActionFactory, $document, $compile, $timeout) {
  this.nesteds = {};
  this.init = function(entity){
    this.entity = entity;
    this.nesteds = {};
    this.columnNesteds = {};
  };

  this.columnNestedsCount = function(){
    return Object.keys(this.columnNesteds).length + 1;
  };

  var addNested = function(containerId, scope, directive){
    var newElement = $compile(directive)(scope);
    var nestedDiv = document.querySelector(containerId);
    angular.element(nestedDiv).append(newElement);
  };

  this.openColumnNested = function(state, containerId, scope){
    var formId = scope.field.entityName;
    if(!this.columnNesteds[formId])
        this.columnNesteds[formId] = {};

    var nestedForms = this.columnNesteds[formId];
    nestedForms.saved = false;
    $document.scrollTop(0, 1000).then(function(){
      var directive = '<carnival-column-form  entity="nestedEntity" fields="nestedEntity.fields" datas="nestedEntity.datas" action="nestedEntity.action" state="'+state+'" related-resources="nestedEntity.relatedResources" editable="true"></carnival-column-form>';
      addNested(containerId, scope, directive);
    });
  };

  this.openSimpleNested = function(state, containerId, scope){
    if(this.isNestedOpen(scope.field.entityName)){
      var self = this;
      this.closeNested(scope.field.entityName);
      $timeout(function(){
        self.openSimpleNested(state, containerId, scope);
      }, 200);
      return;
    }
    if(!this.nesteds[scope.field.entityName])
        this.nesteds[scope.field.entityName] = {};

    var nestedForms = this.nesteds[scope.field.entityName];
    nestedForms.saved = false;
    var directive = '<carnival-nested-form state="'+state+'" type="nested" entity="nestedEntity"></carnival-nested-form></div>';
    addNested(containerId, scope, directive);
  };

  this.isNestedOpen = function(formId){
    if(!this.nesteds[formId])
      return false;
    return true;
  };

  this.closeColumn = function(formId){
    delete this.columnNesteds[formId];
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

