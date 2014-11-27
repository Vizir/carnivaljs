define(function (require) {

  var editCtrl = ['$scope',
                  '$stateParams',
                  '$state',
                  'Api',
                  'Entity',
                  'SharedData',
                  '$http',
  function ($scope, $stateParams, $state, Api, Entity, SharedData, $http) {

    var entity = Entity.getEntity($stateParams.entity);
    var fields = entity.getFields();
    var id = $stateParams.id;
    
    $scope.entityName = entity.name;
    $scope.entityLabel = entity.label;
    $scope.entityRelations = entity.relations;
    $scope.entityFields = [];
    
    fields.forEach(function (field) {
      if (entity.checkFieldView(field.name, 'edit')) {
        $scope.entityFields.push(field);
      }
    });

    SharedData.loading++;
    $http.get(Api.getBaseApiUrl() + '/' + entity.name + '/' + id)
    .success(function (data, status, headers, config) {
      SharedData.loading--;
      $scope.form = data;
    })
    .error(function (data, status, headers, config) {
      SharedData.loading--;
      SharedData.notifications.push({ message: data.error.message, type: 'error' });
    });

    $scope.save = function () {
      var values = angular.copy($scope.form);
      SharedData.loading++;
      $http.put(Api.getBaseApiUrl() + '/' + entity.name + '/' + id, values)
      .success(function (data, status, headers, config) {
        SharedData.loading--;
        SharedData.notifications.push({ message: 'Success on edit!', type: 'success' });
        $state.reload();
      })
      .error(function (data, status, headers, config) {
        SharedData.loading--;
        SharedData.notifications.push({ message: data.error.message, type: 'error' });
      });
    };

  }];

  return editCtrl;

});