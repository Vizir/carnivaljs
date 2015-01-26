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
    isolateScope.start();
    expect(isolateScope.isDeleting).to.be.equal(true);
  });

  it('when click on Cancel should change isDeleting to false', function () {
    isolateScope.cancel();
    expect(isolateScope.isDeleting).to.be.equal(false);
  });

  it('when click on Confirm should execute the action', function () {
    isolateScope.action_test = 0;
    isolateScope.action = function () {
      isolateScope.action_test = 1;
    };
    isolateScope.$digest();
    isolateScope.confirm();
    expect(isolateScope.action_test).to.be.equal(1);
  });

});
