describe('On carnival-wysiwyg component', function () {
  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.label = 'Answer to the Ultimate Question of Life, the Universe, and Everything';
    scope.data = 'Forty-Two';
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-wysiwyg-field label="label" data="data"></carnival-wysiwyg-field>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should have the appropriate label on scope', function () {
    expect(element.isolateScope().label).to.equal('Answer to the Ultimate Question of Life, the Universe, and Everything');
  });

  it('should have the appropriate value from the model on scope', function () {
    expect(element.isolateScope().data).to.be.equal('Forty-Two');
  });

});
