describe('On Entities Model', function () {
  var entity, entityModel, httpBackend;

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

    inject(function(EntityModel, $httpBackend) {
      entityModel = EntityModel;
      httpBackend = $httpBackend;
    });

    entity = new entityModel(datas.name, datas.options);

  });

  it('should define the name properly', function () {
    console.log(entity);
    expect(entity.name).to.be.equal('flowers');
  });

  it('should define the label properly', function () {
    expect(entity.label).to.be.equal('Flowers');
  });

  it('should define identifier properly', function () {
    expect(entity.identifier).to.be.equal('name');
  });

  it('should define the filters properly', function () {
    expect(entity.filters.length).to.be.equal(3);
    expect(entity.filters[1]).to.be.equal('draft');
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

});
