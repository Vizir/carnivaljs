describe('On carnival-currency-field component', function () {
  var compile, element, scope, compiledElement;

  var setScopeData = function (scope) {
    scope.data = 20;
    scope.field = {
      options: {
        symbol: '$',
        decimalDelimiter: '.',
        thousandsDelimiter: ','
      }
    };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-currency-field field="field" data="data"></carnival-currency-field>');
    compiledElement = compile(element)(scope);
    scope.$digest();

  });

  it('should render the template', function () {
    expect(element.html()).to.not.be.equal('');
  });

  it('should show the value formatted with the currency options', function () {
    expect(element[0].getElementsByTagName('input')[0].value).to.be.equal('$ 20.00');
  });

});
