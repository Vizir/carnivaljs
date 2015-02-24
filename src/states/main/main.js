angular.module('carnival')
.controller('MainController', function ($scope, $state, $rootScope, Configuration) {

  var app_name = $scope.app_name = Configuration.getAppName(),
      menu_items = $scope.menu_items = Configuration.getNavbarItems();

  var getFirstEntityItemOnMenu = function () {
    for (var i = 0, x = menu_items.length; i < x; i += 1) {
      if (menu_items[i].link.type === 'entity') {
        return menu_items[i];
      }
    }
    return false;
  };

  var checkInitialPage = function () {
    var initialPage = Configuration.getInitialPage();
    if (!initialPage || Object.keys(initialPage).length <= 0) {
      initialPage = {
        type: getFirstEntityItemOnMenu().link.type,
        entity: getFirstEntityItemOnMenu().link.url
      };
    }
    if (!initialPage) {
      return;
    }
    if (initialPage.type === 'entity') {
      $state.go('main.list', { entity: initialPage.entity });
      return;
    }
    if (initialPage.type === 'state') {
      $state.go(initialPage.state.name, initialPage.state.options);
      return;
    }
  };

  $rootScope.$on('$stateChangeSuccess', function () {
    if ($state.current.name === 'main') {
      checkInitialPage();
    }
  });

  $rootScope.$broadcast('$stateChangeSuccess');

});
