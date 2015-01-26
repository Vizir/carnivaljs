describe('ActionFactory', function(){
  var ActionFactory, entity = {};

  beforeEach(function(){
    module('carnival');
    inject(function(_ActionFactory_){
      ActionFactory = _ActionFactory_;
    });

    entity = {
      model: {
        name: 'cats'
      },

      create: function(data){
        //creating 
      },

      nestedForms: {
        owners: {
        
        }
      }
    };
  });

  it("should create correct actions for create", function(){
    var spy = sinon.spy(ActionFactory, 'buildCreateFunction');
    var action = ActionFactory.buildAction(entity, 'create');
    expect(action.name).to.be.equal('action');
    expect(spy.calledOnce).to.be.equal(true);
  });

  it("should create correct actions for edit", function(){
    var spy = sinon.spy(ActionFactory, 'buildEditFunction');
    var action = ActionFactory.buildAction(entity, 'edit');
    expect(action.name).to.be.equal('action');
    expect(spy.calledOnce).to.be.equal(true);
  });

  it("should create correct actions for show", function(){
    var spy = sinon.spy(ActionFactory, 'buildShowFunction');
    var action = ActionFactory.buildAction(entity, 'show');
    expect(action.name).to.be.equal('action');
    expect(spy.calledOnce).to.be.equal(true);
  });

  it("should create correct actions for list", function(){
    var spy = sinon.spy(ActionFactory, 'buildListFunction');
    var action = ActionFactory.buildAction(entity, 'index');
    expect(action.name).to.be.equal('actions');
    expect(spy.calledOnce).to.be.equal(true);
  });
});
