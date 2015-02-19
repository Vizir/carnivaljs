describe('On carnival-delete-button component', function () {
  var compile, element, scope, isolateScope;

  var setScopeData = function (scope) {
    scope.itemId = '';
    scope.action = '';
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-delete-button></carnival-delete-button>');
    compile(element)(scope);
    scope.$digest();

    isolateScope = element.isolateScope();

  });

  it('when click on Delete should change isDeleting to true', function () {
    isolateScope.delete();
    expect(isolateScope.isDeleting).to.be.equal(true);
  });

});
