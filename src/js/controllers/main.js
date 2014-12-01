angular.module('main', [])
.controller('mainCtrl', ['$scope', 'Api', 'Entity', 'SharedData', function ($scope, Api, Entity, SharedData) {

  var entities = Entity.getEntities();

  $scope.applicationName = Api.getAppName();
  $scope.notifications = SharedData.notifications;
  $scope.loading = SharedData.loading;
  $scope.menuItems = [];

  entities.forEach(function (entity) {
    $scope.menuItems.push({
      name: entity.name,
      label: entity.label
    });
  });

}]);