describe('On carnival-quickfilter component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.filters = [
      { label: 'Huey', field: 'nephews', value: function () {
        return 'huey';
      }},
      { label: 'Dewey', field: 'nephews', value: function () {
        return 'dewey';
      }},
      { label: 'Louie', field: 'nephews', value: function(){
        return 'louie';
      }}
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
