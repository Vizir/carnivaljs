angular.module('carnival')
.service('FormService', function (Configuration, ActionFactory, $document, $compile, $timeout) {
  this.nesteds = {};
  this.init = function(entity){
    this.entity = entity;
    this.nesteds = {};
    this.columns = {};
  };

  this.columnsCount = function(){
    return Object.keys(this.columns).length + 1;
  };

  var addNested = function(containerId, scope, directive){
    var newElement = $compile(directive)(scope);
    var nestedDiv = document.querySelector(containerId);
    angular.element(nestedDiv).append(newElement);
  };

  this.openColumn = function(state, containerId, scope){
    var formId = scope.entity.name;
    if(!this.columns[formId])
        this.columns[formId] = {};

    var nestedForms = this.columns[formId];
    $document.scrollTop(0, 1000).then(function(){
      var directive = '<carnival-column-form  entity="entity" state="'+state+'"></carnival-column-form>';
      addNested(containerId, scope, directive);
    });
  };

  this.openColumnListing = function(state, containerId, scope){
    var formId = 'listing-' +  scope.entity.name;
    if(!this.columns[formId])
        this.columns[formId] = {};

    var nestedForms = this.columns[formId];
    $document.scrollTop(0, 1000).then(function(){
      var directive = '<carnival-column-listing entity="entity" field="field" datas="datas"></carnival-column-listing>';
      addNested(containerId, scope, directive);
    });
  };

  this.openNested = function(state, containerId, scope){
    if(this.isNestedOpen(scope.entity.name)){
      var self = this;
      this.closeNested(scope.field.entityName);
      $timeout(function(){
        self.openNested(state, containerId, scope);
      }, 200);
      return;
    }
    if(!this.nesteds[scope.field.entityName])
        this.nesteds[scope.field.entityName] = {};

    var nestedForms = this.nesteds[scope.field.entityName];
    var directive = '<carnival-nested-form state="'+state+'" type="nested" entity="entity"></carnival-nested-form></div>';
    addNested(containerId, scope, directive);
  };

  this.isNestedOpen = function(formId){
    if(!this.nesteds[formId])
      return false;
    return true;
  };

  this.closeColumn = function(formId){
    delete this.columns[formId];
  };

  this.closeNested = function(formId){
    delete this.nesteds[formId];
  };
});

