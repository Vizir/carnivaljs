describe('On Entities Model', function () {
  var entity, Entity, httpBackend;

  var datas = {name: 'flowers', options: {
    label: 'Flowers',
    identifier: 'name',
    filters: ['published', 'draft', 'archived'],
    fields: {
      'name': {
        identifier: true,
        label: 'Name',
        type: 'text',
        views: {
          index: {
            enable: false
          },
          create: {
            enable: false
          },
          show: {
            enable: false
          },
          edit: {
            enable: false
          }
        }
      },
      'color': {
        label: 'Color',
        type: 'text',
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          show: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      }
    }

  }};

  beforeEach(function () {
    module('carnival');

    inject(function(_Entity_, $httpBackend) {
      Entity = _Entity_;
      httpBackend = $httpBackend;
    });

    entity = new Entity(datas.name, datas.options);

  });

  it('should define the name properly', function () {
    expect(entity.name).to.be.equal('flowers');
  });

  it('should define the label properly', function () {
    expect(entity.label).to.be.equal('Flowers');
  });

  it('should define identifier properly', function () {
    expect(entity.identifier).to.be.equal('name');
  });

  it('should define the fields properly', function () {
    expect(entity.fields.length).to.be.equal(2);
    expect(entity.fields[0].name).to.be.equal('name');
    expect(entity.fields[0].type).to.be.equal('text');
    expect(entity.fields[0].label).to.be.equal('Name');
    expect(entity.fields[0].views.index.enable).to.be.equal(false);
  });

  describe('method', function () {
    it('checkFieldView should return if the specified field may be visible', function () {
      expect(entity.checkFieldView('name', 'index')).to.be.equal(false);
      expect(entity.checkFieldView('color', 'index')).to.be.equal(true);
    });
  });
  
  describe('actions', function(){

    describe('list', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
        });

        entity.getList('offset', 'limit', 'order', 'orderDir', 'search');  
      }); 
    }); 

    describe('getOne', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
        });

        entity.getOne(10);  
      }); 
    }); 

    describe('delete', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
        });

        entity.delete(10);  
      }); 
    }); 

    describe('create', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
        });

        entity.create({name: 'Vizir'});  
      }); 
    }); 

    describe('update', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
        });

        entity.update(100, {name: 'Vizir'});  
      }); 
    }); 
  });

  describe('actions with extraParams', function(){
    beforeEach(function(){
      datas.options.extraReqParams = {
        list: {
          extra: 'extra'
        },
        edit: {
          extra: 'extra'
        },
        show: {
          extra: 'extra'
        },
        delete: {
          extra: 'extra'
        }
      };
    
    }); 
    describe('list', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
          expect(params.extraParams !== null).to.be.equal(true);
        });

        entity.getList('offset', 'limit', 'order', 'orderDir', 'search');  
      }); 
    }); 

    describe('getOne', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
          expect(params.extraParams !== null).to.be.equal(true);
        });

        entity.getOne(10);  
      }); 
    }); 

    describe('delete', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
          expect(params.extraParams !== null).to.be.equal(true);
        });

        entity.delete(10);  
      }); 
    }); 

    describe('create', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
          expect(params.extraParams !== null).to.be.equal(true);
        });

        entity.create({name: 'Vizir'});  
      }); 
    }); 

    describe('update', function(){
      it('should make the correct request', function(){
        sinon.stub(entity, 'request', function(params){
          expect(params !== null).to.be.equal(true);
          expect(params.extraParams !== null).to.be.equal(true);
        });

        entity.update(100, {name: 'Vizir'});  
      }); 
    }); 
  });


});
