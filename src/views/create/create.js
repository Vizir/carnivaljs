angular.module('carnival.controllers')
.controller('CreateController', ['$scope', '$stateParams', '$state', 'Entity', 'SharedData', 'http', function ($scope, $stateParams, $state, Entity, SharedData, http) {
    
  var entity = Entity.getEntity($stateParams.entity);
  var fields = entity.fields;

  $scope.entityName = entity.name;
  $scope.entityLabel = entity.label;
  $scope.entityFields = [];
  $scope.form = {};

  fields.forEach(function (field) {
    if (entity.checkFieldView(field.name, 'create')) {
      $scope.entityFields.push(field);
    }
  });

  $scope.save = function () {
    var values = angular.copy($scope.form);
    http.post(entity, values).then(function () {
      SharedData.notifications.push({ message: 'Success on create!', type: 'success' });
      $state.go('main.list', { entity: entity.name }, {reload: true});
    }).catch(function (data) {
      SharedData.notifications.push({ message: data.error.message, type: 'error' });
    });
  };

}]);