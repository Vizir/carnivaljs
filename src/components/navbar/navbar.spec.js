describe('On carnival-navbar component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.app_name = 'What does the Fox say?';
    scope.menu_items = [
      {
        label: 'Ring-ding-ding-ding-dingeringeding',
        link: {
          type: 'entity',
          url: 'ringring'
        }
      },
      {
        label: 'Wa-pa-pa-pa-pa-pa-pow',
        link: {
          type: 'entity',
          url: 'wapapow'
        }
      },
      {
        label: 'Hatee-hatee-hatee-ho',
        link: {
          type: 'url',
          url: 'http://hateeho.com'
        }
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

  it('should render the application name', function () {
    expect(element.html())
    .to.contain('What does the Fox say?');
  });

  it('should render the menu items', function () {
    expect(element.html())
    .to.contain('Ring-ding-ding-ding-dingeringeding')
    .to.contain('Wa-pa-pa-pa-pa-pa-pow')
    .to.contain('Hatee-hatee-hatee-ho');
  });

  it('should render links to lists on menu', function () {
    expect(element.html())
    .to.contain('href="#/list/ringring')
    .to.contain('href="#/list/wapapow')
    .to.contain('href="http://hateeho.com');
  });

});
