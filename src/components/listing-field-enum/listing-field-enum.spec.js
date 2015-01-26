describe('On carnival-listing-field-enum component', function () {

  var element, scope, compile;

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
  });

  beforeEach(function () {
    setScopeData(scope);
    element = angular.element('<carnival-listing-field-enum item="item" field="field"></carnival-listing-field-enum>');
    compile(element)(scope);
    scope.$digest();
  });

  it('should render the enum', function () {
    expect(element.html()).to.contain('Whiskers!');
  });

});
