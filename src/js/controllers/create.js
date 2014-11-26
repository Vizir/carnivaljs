define(function (require) {

  var angular = require('angular');

  var createCtrl = ['$scope',
                    '$stateParams',
                    '$state',
                    'Api',
                    'Entity',
                    'SharedData',
                    '$http',
  function ($scope, $stateParams, $state, Api, Entity, SharedData, $http) {
    
    var entity = Entity.getEntity($stateParams.entity);
    var fields = entity.getFields();

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
      SharedData.loading++;
      $http.post(Api.getBaseApiUrl() + '/' + entity.name, values)
      .success(function (data, status, headers, config) {
        SharedData.loading--;
        SharedData.notifications.push({ message: 'Success on create!', type: 'success' });
        $state.go('main.list', { entity: entity.name }, {reload: true});
      })
      .error(function (data, status, headers, config) {
        SharedData.loading--;
        SharedData.notifications.push({ message: data.error.message, type: 'error' });
      });
    };

  }];

  return createCtrl;

});