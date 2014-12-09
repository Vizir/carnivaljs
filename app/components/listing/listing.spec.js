describe('On carnival-listing component', function () {
  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.fields = [
      { name: 'food', label: 'Food' },
      { name: 'taste', label: 'Taste' }
    ];
    scope.datas = [
      { food: 'Lasagna', taste: 'Good' },
      { food: 'Lettuce', taste: 'Not Good' }
    ];
    scope.actions = {
      edit: { label: 'Edit me Yarrr', click: function () {} },
      show: { label: 'Me likes Shows', click: function () {} },
      delete: { click: function () {} }
    };
    scope.identifier = 'food';
    scope.entityName = 'Restaurant';
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-listing entity-name="entityName" actions="actions" identifier="identifier" datas="datas" fields="fields"></carnival-listing>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render the columns headers', function () {
    expect(element.html())
    .to.contain('Food')
    .to.contain('Taste');
  });

  it('should render the rows\' content', function () {
    expect(element.html())
    .to.contain('Lasagna').to.contain('Good')
    .to.contain('Lettuce').to.contain('Not Good');
  });

  it('should create the action buttons', function () {
    expect(element.html())
    .to.contain('Edit me Yarrr')
    .to.contain('Me likes Shows')
    .to.contain('Delete');
  });

});
