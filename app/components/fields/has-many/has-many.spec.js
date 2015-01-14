describe('On carnival-has-many component', function () {
  var compile, element, scope, Configuration, tagEntity, compiledElement;

  //Need to create a cross browser click() function no .click() in PhantomJS
  function click(el){
      var ev = document.createEvent('MouseEvent');
      ev.initMouseEvent(
          'click',
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0, /* coordinates */
          false, false, false, false, /* modifier keys */
          0 /*left*/, null
      );
      el.dispatchEvent(ev);
  }

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
      entityName: 'tags',
      views: {
        edit: {
          enableDelete: true
        }
      }
    };

    scope.entity = {
      name: 'posts',
      nestedForms: [],
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
    compiledElement = compile(element)(scope);
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

  describe('user click on remove and the field has a enableDelelte enable', function(){
    it('should call the delete function on entity field', function(done){
      scope.state = 'edit';
      scope.datas.tags = [{id: 1, name: 'one'}];
      tagEntity.delete = function(id){done();};

      scope.$digest();
      var removeButton = compiledElement.find('a')[1];
      click(removeButton);
    });
  });

});
