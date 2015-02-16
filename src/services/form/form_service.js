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

  this._addColumn = function(directive, formId, containerId, scope){
    if(!this.columns[formId])
        this.columns[formId] = {};

    $document.scrollTop(0, 1000).then(function(){
      addNested(containerId, scope, directive);
    });
  };

  this.openColumn = function(state, containerId, scope){
    var formId = 'form-' +  scope.entity.name;
    var directive = '<carnival-form-column type="form" entity="entity" state="'+state+'"></carnival-form-column>';
    this._addColumn(directive, formId, containerId, scope);
  };

  this.openColumnListing = function(state, containerId, scope){
    var formId = 'table-' +  scope.entity.name;
    var directive = '<carnival-form-column type="table" field="field" entity="entity" datas="datas"></carnival-form-column>';
    this._addColumn(directive, formId, containerId, scope);
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

