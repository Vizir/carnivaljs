describe('On carnival-enum-field component', function () {
  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.field = {
      name: 'catFood',
      values: [
        { value: 1, label: 'Whiskers!' },
        { value: 2, label: 'Sache!' }
      ]
    };
    scope.item = { catFood: 1 };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-enum-field data="item" field="field"></carnival-enum-field>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render an select with the values', function () {
    expect(element.html()).to.contain('<select');
    expect(element.html()).to.contain('Whiskers!');
    expect(element.html()).to.contain('Sache!');
  });

});
