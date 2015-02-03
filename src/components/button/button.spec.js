describe('On carnival-button component', function () {
  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.style = 'primary';
    scope.size = 'xs';
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-button label="42" style=" '+ scope.style +' " size="'+ scope.size +'"></carnival-button>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render a button with the specified style class', function () {
    expect(element[0].getAttribute('class')).to.contain('primary');
  });

  it('should render a button with the specified size class', function () {
    expect(element[0].getAttribute('class')).to.contain('xs');
  });

  it('should render a button with the specified label', function () {
    expect(element.html()).to.contain('42');
  });

});
