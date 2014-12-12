describe('On carnival-order-ctrl component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.page = {
      field: 'food'
    };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-order-ctrl current-page="field"></carnival-order-ctrl>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render the field initially with the arrow up', function () {
    expect(element[0].getElementsByClassName('glyphicon-chevron-up')[0].classList.contains('ng-hide')).to.be.equal(true);
  });

  it('should render the field with the arrow down', function () {
  });

});
