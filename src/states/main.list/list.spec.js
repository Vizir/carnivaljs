describe('On ListController', function() {

  var controller, Configuration, ShowController, rootScope = {};

  var $stateParams = {
    entity: 'cats'
  };

  beforeEach(function () {
    module('carnival');

    inject(function($controller, $rootScope, _Configuration_){
      controller = $controller;
      rootScope = $rootScope;
      Configuration = _Configuration_;
    });

    sinon.stub(Configuration, 'getEntity', function(name){
      return SpecHelper.catConfiguration;
    });

    controller('MainController', {
      $scope: rootScope
    });

    $scope = rootScope.$new();
    ListController = controller('ListController', {
      $scope: $scope
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
    expect($scope.entity.fields.length).to.be.equal(3);
  });

  it('should fill the scope with the fields information properly', function () {
    expect($scope.entity.fields[1].name).to.be.equal('owner');
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
