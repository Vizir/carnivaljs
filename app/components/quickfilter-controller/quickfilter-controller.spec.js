describe('On carnival-quick-field component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.filters = [
      { label: 'Huey', field: 'nephews', value: 'huey' },
      { label: 'Dewey', field: 'nephews', value: 'dewey' },
      { label: 'Louie', field: 'nephews', value: 'louie' }
    ];
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-quick-filter filters="filters"></carnival-quick-filter>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should do something', function () {
    expect(element.html()).to.contain('Huey');
    expect(element.html()).to.contain('Dewey');
    expect(element.html()).to.contain('Louie');
  });

});
