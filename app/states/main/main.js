angular.module('carnival')
.controller('MainController', function ($scope, Configuration) {

  var app_name = $scope.app_name = Configuration.getAppName(),
      menu_items = $scope.menu_items = [],
      entities = Configuration.getEntities();

  for (var i = 0, x = entities.length; i < x; i += 1) {
    menu_items.push({
      name: entities[i].name,
      label: entities[i].label
    });
  }

});
