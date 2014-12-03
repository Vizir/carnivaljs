angular.module('carnival.controllers')
.controller('MainController', ['$scope', 'Api', 'Entity', 'EntityModel', function ($scope, Api, Entity, EntityModel) {

  var app_name = $scope.app_name = Api.getAppName(),
      menu_items = $scope.menu_items = [],
      entities = Entity.getEntities();

  for (var i = 0, x = entities.length; i < x; i += 1) {
    menu_items.push({
      name: entities[i].name,
      label: entities[i].options.label
    });
  }

}]);