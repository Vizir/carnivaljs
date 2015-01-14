describe('On carnival-has-many component', function () {
  var compile, element, scope, Configuration, tagEntity;
  

  tagEntity = {
        name: 'tags',
        fields: [
          {name: 'post', type: 'hasMany', entityName: 'posts', required: 'true'}
        ]
      };
  tagEntity.getFieldByEntityName = function(){return tagEntity.fields[0];};

  var setScopeData = function (scope) {
    scope.relatedResources = {
      tags: [{ id: 1, name: 'one' }, { id: 2, name: 'two' }]
    };

    scope.datas = {
      tags: [],
      title: 'title'
    };

    scope.field = {
      name: 'tags',
      identifier: 'id',
      field: 'name',
      endpoint: 'tags',
      type: 'hasMany',
      entityName: 'tags'
    };

    scope.entity = {
      name: 'posts',
      fields: [
        {
          name: 'title', type: 'string'
        },
        scope.field
      ]
    };

    scope.nestedFormIndex = 1;
    scope.editable = 'editable';
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile, _Configuration_) {
      scope = $rootScope.$new();
      compile = $compile;
      Configuration = _Configuration_;
    });

    sinon.stub(Configuration, 'getEntity', function(entityName){
      return tagEntity;
    });
    setScopeData(scope);

    element = angular.element('<carnival-has-many-field entity="entity" nested-form-index="nestedFormIndex" field="field" datas="datas" action="entity.action" state="edit" related-resources="relatedResources" editable="true"></carnival-has-many-field>');
    compile(element)(scope);
    scope.$digest();
  });

  it('should have the appropriate label on scope', function () {
    expect(element.html()).to.contain('select');
    expect(element.html()).to.contain('one');
    expect(element.html()).to.contain('two');
  });

  describe('post doesnt contain tags', function(){
    it('should not render li element', function () {
      expect(element.html()).to.not.contain('<li');
    });
  });

  describe('post contains tags', function(){
    it('should render li element', function () {
      scope.datas.tags = [{id: 1, name: 'one'}];
      scope.$digest();
      expect(element.html()).to.contain('<li');
    });
  });

  describe('the fieldEntity has a belongsTo relation with the entity and is required', function(){
    it('should not render the selec', function(){
      tagEntity.fields[0].type = 'belongsTo';
      scope.$digest();
      expect(element.html()).to.contain('ng-hide');
    });
  });

});
