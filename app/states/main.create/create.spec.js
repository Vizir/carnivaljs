describe('On CreateController', function() {

  var controller, CreateController, rootScope = {};

  var Configuration = {
    getAppName: function() {
      return "Test";
    },
    getEntities: function () {
      return []; 
    },
    getEntity: function () {
      return {
        name: 'cats',
        label: 'Cats',
        identifier: 'whiskers',
        actions: ['edit', 'create', 'show', 'delete'],
        fields: [
          {
            name:  'whiskers',
            label: 'Whiskers',
            type:  'text',
            views: {
              index: {
                enable: true
              },
              create: {
              },
              show: {
                enable: true
              },
              edit: {
                enable: true
              }
            }
          },
          {
            name: 'owners',
            label: 'Owner',
            type: 'belongsTo',
            resourceLabel: 'name',
            resourceName: 'owners',
            views: {
              edit: {
                enable: true
              },
              create: {
                enable: true
              }
            }
          },
          {
            name:  'fur',
            label: 'Fur',
            type:  'text',
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
        ],
        checkFieldView: function () {
          return true;
        },
        getList: function () {
          return {
            success: function () {
              return true;
            }
          };
        }
      };
    }
  };

  var $stateParams = {
    entity: 'cats'
  };

  beforeEach(function () {
    module('carnival');
    inject(function($controller, $rootScope){
      controller = $controller;
      rootScope = $rootScope;
    });

    controller('MainController', {
      $scope: rootScope,
      Configuration: Configuration
    });
    $scope = rootScope.$new();
    CreateController = controller('CreateController', {
      $scope: $scope,
      Configuration: Configuration
    });
  });

  it('should fill the scope with the entity\'s label', function () {
    expect($scope.entity.label).to.be.equal('Cats');
  });

  it('should fill the scope with the entity\'s fields', function () {
    expect($scope.entity.fields.length).to.be.equal(3);
  });

  it('should fill the scope with the fields information properly', function () {
    expect($scope.entity.fields[1].name).to.be.equal('owners');
    expect($scope.entity.fields[1].label).to.be.equal('Owner');
    expect($scope.entity.fields[1].type).to.be.equal('belongsTo');
    expect($scope.entity.fields[1].views.edit.enable).to.be.equal(true);
  });

  it('should fill the scope with the fields information properly', function () {
    expect($scope.entity.fields[2].name).to.be.equal('fur');
    expect($scope.entity.fields[2].label).to.be.equal('Fur');
    expect($scope.entity.fields[2].type).to.be.equal('text');
    expect($scope.entity.fields[2].views.edit.enable).to.be.equal(true);
  });

  it('should fill the scope with the action', function () {
    expect($scope.entity.action).to.not.be.null();
  });

  it('should have a function to called on action click', function () {
    expect(typeof $scope.entity.action.click).to.be.equal('function');
  });

  it('should have nothing on scope datas', function () {
    expect(Object.keys($scope.entity.datas).length).to.be.equal(0);
  });

});
