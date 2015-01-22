describe('FormService', function(){
  beforeEach(function(){
    module('carnival');
    inject(function(_FormService_, _Configuration_, _ActionFactory_){
      FormService = _FormService_;
    });
  });

  describe('#init', function(){

    describe('when is a new service', function(){
      it('should init the service', function(){
        FormService.init('entityName');
        expect(FormService.entity).to.be.equal('entityName');
        expect(Object.keys(FormService.nesteds).length).to.be.equal(0);
      });
    });

    describe('when is a old service', function(){
      it('should init the service', function(){
        FormService.entityName = 'otherName';
        FormService.nesteds = {'form1': [], 'form2': []};
        FormService.init('entityName');
        expect(FormService.entity).to.be.equal('entityName');
        expect(Object.keys(FormService.nesteds).length).to.be.equal(0);
      });
    });

  });

  describe('#openNested', function(){
    it('should create a nestedForm with saved == false', function(){
      FormService.openNested('newFormId');
      expect(FormService.nesteds.newFormId.saved).to.be.equal(false);
    });
  });

  describe('#isNestedOpen', function(){
    describe('when is a not open', function(){
      it('should return false', function(){
        FormService.init('entityName');
        var result = FormService.isNestedOpen('nestedName');
        expect(result).to.be.equal(false);
      });
    });

    describe('when is open', function(){
      it('should return true', function(){
        FormService.init('entityName');
        FormService.openNested('nestedName');
        var result = FormService.isNestedOpen('nestedName');
        expect(result).to.be.equal(true);
      });
    });
  });

  describe('#saveNested', function(){
    it('should update a nestedForm with saved == true', function(){
      FormService.openNested('newFormId');
      FormService.saveNested('newFormId');
      expect(FormService.nesteds.newFormId.saved).to.be.equal(true);
    });
  });

  describe('#hasUnsavedNested', function(){

    describe('has Unsaved Nested', function(){
      it('should respond true', function(){
        FormService.openNested('newFormId');
        var result = FormService.hasUnsavedNested();
        expect(result).to.be.equal(true);
      });
    });

    describe('not has Unsaved Nested', function(){
      it('should respond false', function(){
        FormService.openNested('newFormId');
        FormService.saveNested('newFormId');
        var result = FormService.hasUnsavedNested();
        expect(result).to.be.equal(false);
      });
    });
  });

});
