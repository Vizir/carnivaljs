describe('On carnival-pagination-controller component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.page = {
      current: 5,
      total: 10
    };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-pagination-ctrl current-page="page.current" total-pages="scope.total"></carnival-pagination-ctrl>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render the navigation previous and next buttons', function () {
    expect(element[0].getElementsByTagName('a')[0].attributes['ng-click']).to.be.not.null();
    expect(element[0].getElementsByTagName('a')[element[0].getElementsByTagName('a').length - 1].attributes['ng-click']).to.be.not.null();
  });

  it('should render the navigation with all indexes', function () {
    expect(element[0].getElementsByTagName('a')[1].innerHTML).to.be.equal('3');
    expect(element[0].getElementsByTagName('a')[2].innerHTML).to.be.equal('4');
    expect(element[0].getElementsByTagName('a')[3].innerHTML).to.be.equal('5');
    expect(element[0].getElementsByTagName('a')[4].innerHTML).to.be.equal('6');
    expect(element[0].getElementsByTagName('a')[5].innerHTML).to.be.equal('7');
  });

});
