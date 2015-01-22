describe('On EditController', function() {

  var controller, EditController, rootScope = {};

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
      if(name === 'cats')
        return SpecHelper.catConfiguration;
      else if(name === 'owners')
        return SpecHelper.ownerConfiguration;
    });

    controller('MainController', {
      $scope: rootScope,
      Configuration: Configuration
    });
    $scope = rootScope.$new();
    EditController = controller('EditController', {
      $scope: $scope,
      Configuration: Configuration,
      $stateParams: $stateParams
    });
    $scope.entity.datas = { whiskers: 'Mr Wiggle TypeX Alpha-Badass', fur: 'Pure Evil\'s Color' };
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

  it('should have a function called on action click', function () {
    expect(typeof $scope.entity.action.click).to.be.equal('function');
  });

  it('should fill the scope with the datas', function () {
    expect($scope.entity.datas.whiskers).to.be.equal('Mr Wiggle TypeX Alpha-Badass');
    expect($scope.entity.datas.fur).to.be.equal('Pure Evil\'s Color');
  });

});
