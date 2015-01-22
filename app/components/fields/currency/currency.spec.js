describe('On carnival-currency-field component', function () {
  var compile, element, scope, compiledElement;

  var setScopeData = function (scope) {
    scope.data = true;
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-currency-field label="label" data="data"></carnival-currency-field>');
    compiledElement = compile(element)(scope);
    scope.$digest();

  });

  it('should be checked', function () {
    expect(element.isolateScope().data).to.equal(true);
  });


});
