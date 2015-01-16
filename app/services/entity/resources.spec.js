describe('EntityResources', function(){
  var entityName = 'cats';
  var EntityResources, Configuration, ActionFactory = {};

  beforeEach(function(){
    module('carnival');
    inject(function(_EntityResources_, _Configuration_, _ActionFactory_){
      EntityResources = _EntityResources_;
      Configuration = _Configuration_;
      ActionFactory = _ActionFactory_;
    });

    sinon.stub(ActionFactory, 'buildAction', function(){
      return {
        action: 'action',
        click: function(){}
      };
    });
    sinon.stub(Configuration, 'getEntity', function(name){
      if(name === 'cats')
        return SpecHelper.catConfiguration;
      else if(name === 'owners')
        return SpecHelper.ownerConfiguration;
    });
  });


  describe('#prepareForCreateState', function(){
    it('should prepare entity for create State', function(){
      var resource = EntityResources.prepareForCreateState(entityName);
      expect(resource.model === null).to.be.equal(false);
      expect(resource.name).to.be.equal('cats');
      expect(resource.label).to.be.equal('Cats');
      expect(resource.identifier).to.be.equal('id');
      expect(resource.fields.length).to.be.equal(3);
      expect(Object.keys(resource.nestedForms).length).to.be.equal(1);
    });
  });


  describe('#prepareForEditState', function(){
    it('should prepare entity for edit State', function(){
      var resource = EntityResources.prepareForEditState(entityName);
      expect(resource.model === null).to.be.equal(false);
      expect(resource.name).to.be.equal('cats');
      expect(resource.label).to.be.equal('Cats');
      expect(resource.identifier).to.be.equal('id');
      expect(resource.fields.length).to.be.equal(3);
      expect(Object.keys(resource.nestedForms).length).to.be.equal(1);
    });
  });

  describe('#prepareForShowState', function(){
    it('should prepare entity for show State', function(){
      var resource = EntityResources.prepareForShowState(entityName);
      expect(resource.model === null).to.be.equal(false);
      expect(resource.name).to.be.equal('cats');
      expect(resource.label).to.be.equal('Cats');
      expect(resource.identifier).to.be.equal('id');
      expect(resource.fields.length).to.be.equal(3);
      expect(Object.keys(resource.nestedForms).length).to.be.equal(0);
    });
  });

  describe('#prepareForListState', function(){
    it('should prepare entity for list State', function(){
      var resource = EntityResources.prepareForShowState(entityName);
      expect(resource.model === null).to.be.equal(false);
      expect(resource.name).to.be.equal('cats');
      expect(resource.label).to.be.equal('Cats');
      expect(resource.identifier).to.be.equal('id');
      expect(resource.fields.length).to.be.equal(3);
      expect(Object.keys(resource.nestedForms).length).to.be.equal(0);
    });
  });
});
