describe('On carnival-navbar component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.app_name = 'Fox';
    scope.menu_items = [
      {
        name: 'Item1',
        label: 'Item1'
      },
      {
        name: 'Item2',
        label: 'Item2'
      },
      {
        name: 'Item3',
        label: 'Item3'
      }
    ];
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-navbar app-name="app_name" menu-items="menu_items"></carnival-navbar>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should have the app name', function () {
    expect(element.isolateScope().appName).to.be.equal('Fox');
  });

  it('should have the menu items', function () {
    expect(element.isolateScope().menuItems.length).to.be.equal(3);
  });

});
