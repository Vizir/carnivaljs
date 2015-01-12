describe('On carnival uploader component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.uploader = {
      endpointUrl: 'http://somewhere/end'
    };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-uploader uploader="uploader"></carnival-uploader>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render an input', function () {
    expect(element.html()).to.contain('<input');
    expect(element.html()).to.contain('type="file"');
  });

});
