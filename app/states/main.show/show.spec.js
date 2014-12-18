describe('On ShowController', function() {

  var controller, ShowController, rootScope = {};

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
              enable: true
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
        getOne: function () {
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
    inject(function($controller, $rootScope, $injector){
      controller = $controller;
      rootScope = $rootScope;
      configurationService = $injector.get('Configuration');
      configurationService.getEntity = Configuration.getEntity;
    });
    controller('MainController', {
      $scope: rootScope,
      Configuration: Configuration
    });
    $scope = rootScope.$new();
    ShowController = controller('ShowController', {
      $scope: $scope,
      Configuration: Configuration
    });
    $scope.entity.datas = { whiskers: 'Sr Whiskers TypeO Dragon Killer', fur: 'Soft like silk' };
  });

  it('should fill the scope with the entity\'s label', function () {
    expect($scope.entity.label).to.be.equal('Cats');
  });

  it('should fill the scope with the entity\'s fields', function () {
    expect($scope.entity.fields.length).to.be.equal(2);
  });

  it('should fill the scope with the fields information properly', function () {
    expect($scope.entity.fields[1].name).to.be.equal('fur');
    expect($scope.entity.fields[1].label).to.be.equal('Fur');
    expect($scope.entity.fields[1].type).to.be.equal('text');
    expect($scope.entity.fields[1].views.show.enable).to.be.equal(true);
  });

  it('should fill the scope with the action', function () {
    expect($scope.entity.action).to.not.be.null();
  });

  it('should have a function called on action click', function () {
    expect(typeof $scope.entity.action.click).to.be.equal('function');
  });

  it('should fill the scope with the datas', function () {
    expect($scope.entity.datas.whiskers).to.be.equal('Sr Whiskers TypeO Dragon Killer');
    expect($scope.entity.datas.fur).to.be.equal('Soft like silk');
  });

});
