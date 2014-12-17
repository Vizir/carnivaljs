describe('On carnival-search-controller component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.fields = [
      {name: 'llama', label: 'Llama', type: 'text'},
      {name: 'alpaca', label: 'Alpaca', resourceName: 'alpacas', type: 'belongsTo'}
    ];
    scope.relatedResources = {
      alpacas: [
        {id: 1, name: 'Brown'},
        {id: 2, name: 'White'}
      ]
    };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-search-ctrl fields="fields" related-resources="relatedResources"></carnival-search-ctrl>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render a submit button', function () {
    expect(element.html()).to.contain('Submit');
  });

});
