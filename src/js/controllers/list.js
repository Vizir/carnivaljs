define(function (require) {

  var listCtrl = ['$scope',
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
    $scope.entityIdentifier = entity.identifier;
    $scope.entityLabel = entity.label;
    $scope.entityFields = [];

    fields.forEach(function (field) {
      if (entity.checkFieldView(field.name, 'list')) {
        $scope.entityFields.push(field);
      }
    });

    SharedData.loading++;
    $http.get(Api.getBaseApiUrl() + '/' + entity.name)
    .success(function (data, status, headers, config) {
      SharedData.loading--;
      $scope.entityContent = data;
    })
    .error(function (data, status, headers, config) {
      SharedData.loading--;
      SharedData.notifications.push({ message: data.error.message, type: 'error' });
    });

    $scope.checkShow = function (action) {
      return entity.checkEntityAction(action);
    };

    $scope.deleteItem = function (index) {
      SharedData.loading++;
      $http.delete(Api.getBaseApiUrl() + '/' + entity.name + '/' + index)
      .success(function (data, status, headers, config) {
        SharedData.loading--;
        SharedData.notifications.push({ message: 'Success on delete!', type: 'warning' });
        $state.reload();
      })
      .error(function (data, status, headers, config) {
        SharedData.loading--;
        SharedData.notifications.push({ message: data.error.message, type: 'error' });
      });
    };

  }];

  return listCtrl;

});