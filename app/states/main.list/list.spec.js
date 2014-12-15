describe('On ListController', function() {

  var controller, ShowController, $scope = {};

  var Configuration = {
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
    inject(function($controller){
      controller = $controller;
    });
    ListController = controller('ListController', {
      $scope: $scope,
      Configuration: Configuration
    });
    $scope.entity.datas = [
      { whiskers: 'Mr Wiggle TypeX Alpha-Badass', fur: 'Pure Evil\'s Color' },
      { whiskers: 'Sr Whiskers TypeO Dragon Killer', fur: 'Soft like silk' }
    ];
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
    expect($scope.entity.fields[1].views.index.enable).to.be.equal(true);
  });

  it('should fill the scope with the action', function () {
    expect($scope.entity.action).to.not.be.null();
  });

  it('should have a function on each action', function () {
    expect(typeof $scope.entity.actions.create).to.be.equal('function');
    expect(typeof $scope.entity.actions.edit).to.be.equal('function');
    expect(typeof $scope.entity.actions.show).to.be.equal('function');
    expect(typeof $scope.entity.actions.delete).to.be.equal('function');
  });

  it('should fill the scope with the datas', function () {
    expect($scope.entity.datas.length).to.be.equal(2);
  });

});
