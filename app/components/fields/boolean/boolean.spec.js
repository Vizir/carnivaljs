describe('On carnival-boolean component', function () {
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

    element = angular.element('<carnival-boolean-field label="label" data="data"></carnival-boolean-field>');
    compiledElement = compile(element)(scope);
    scope.$digest();

  });

  it('should be checked', function () {
    expect(element.isolateScope().data).to.equal(true);
  });


});
