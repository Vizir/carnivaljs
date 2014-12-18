describe('On carnival-select component', function () {
  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.relatedResources = {
        categories: [{ id: 1, name: 'one' }, { id: 2, name: 'two' }]
      };
    scope.datas = {
      category: null
    };
    scope.resourceLabel = 'name';
    scope.identifier = 'id';
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-select-field data="datas.category" resource-label="resourceLabel" identifier="identifier" items="relatedResources.categories" editable="editable"></carnival-select-field>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should have the appropriate label on scope', function () {
    expect(element.html()).
    to.contain('one');
  });

});
