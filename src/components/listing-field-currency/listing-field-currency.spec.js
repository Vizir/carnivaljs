describe('On carnival-listing-field-currency component', function () {

  var element, scope, compile;

  var setScopeData = function (scope) {
    scope.field = {
      name: 'catFoodPrice',
      options: {
        symbol: '$',
        decimalDelimiter: '.',
        thousandsDelimiter: ',',
        decimals: 2
      }
    };
    scope.item = { catFoodPrice: 100.00 };
  };

  beforeEach(function () {
    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  });

  beforeEach(function () {
    setScopeData(scope);
    element = angular.element('<carnival-listing-field-currency item="item" field="field"></carnival-listing-field-currency>');
    compile(element)(scope);
    scope.$digest();
  });

  it('should render the currency, formated', function () {
    expect(element.html()).to.contain('$ 100.00');
  });

});
