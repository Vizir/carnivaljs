describe('On carnival-order-ctrl component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.page = {
      field: 'food'
    };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-order-ctrl current-page="field"></carnival-order-ctrl>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render the template', function () {
    expect(element.html()).to.not.be.null();
  });

});
