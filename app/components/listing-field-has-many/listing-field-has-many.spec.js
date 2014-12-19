describe('On listing-field-has-many component', function () {
  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.item = {};
    scope.field = {
      resourceName: 'comments',
      from: 'post'
    };

  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-listing-field-has-many item="item" field="field"></carnival-listing-field-has-many');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render a link', function () {
    expect(element.html()).to.contain('#/list/comments');
  });

  it('should render the link with a search filter', function () {
    expect(element.html()).to.contain('search');
    expect(element.html()).to.contain('post');
  });

});
