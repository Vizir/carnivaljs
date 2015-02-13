describe('FormService', function(){
  var Configuration, FormService;
  beforeEach(function(){
    module('carnival');
    inject(function(_FormService_, _Configuration_, _ActionFactory_){
      FormService = _FormService_;
      Configuration = _Configuration_;
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

  describe('#canShowThisField', function(){
    describe('when field is not a relation', function(){
      var formEntity = {};
      var state = 'create';
      var field = {type: 'string'};

      it('should return true', function(){
        var result = FormService.canShowThisField(formEntity, state, field);
        expect(result).to.be.equal(true);
      });
    });

    describe('when is a nested Form', function(){
      describe('when field entity is the same as the parentEntity', function(){
        var formEntity = {parentEntity:{name: 'nameOfEntity'}};
        var state = 'create';
        var field = {type: 'hasMany', entityName: 'nameOfEntity'};
        it('should respond false', function(){
          var result = FormService.canShowThisField(formEntity, state, field);
          expect(result).to.be.equal(false);
        });
      });
    });

    describe('when is a create', function(){
      describe('when the relation are hasMany <=> belongsTo', function(){
        var formEntity = {};
        var state = 'create';
        var field = {type: 'hasMany', views: {create: {showOptions: false}}, entityName: 'nameOfEntity'};

        var relationField = {
            getFieldByEntityName: function(){
              return {
                type: 'belongsTo'
              };
            }
          };
          beforeEach(function(){
            sinon.stub(Configuration, 'getEntity', function(){
              return relationField;
            });
          });

        it('should return false', function(){
          var result = FormService.canShowThisField(formEntity, state, field);
          expect(result).to.be.equal(false);
        });
      });
    });

  });
});
