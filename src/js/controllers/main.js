define(function () {

  var mainCtrl = ['$scope', 'Api', 'Entity', function ($scope, Api, Entity) {

    var entities = Entity.getEntities();

    $scope.applicationName = Api.getAppName();
    $scope.menuItems = [];

    entities.forEach(function (entity) {
      $scope.menuItems.push({
        name: entity.name,
        label: entity.label
      });
    });

  }];

  return mainCtrl;

});