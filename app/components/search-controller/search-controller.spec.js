describe('On carnival-search-controller component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.fields = [
      {name: 'llama', label: 'Llama'},
      {name: 'alpaca', label: 'Alpaca'}
    ];
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-search-ctrl fields="fields"></carnival-search-ctrl>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render a form with fields', function () {
    expect(element.html()).to.contain('Llama');
    expect(element.html()).to.contain('Alpaca');
  });

});
