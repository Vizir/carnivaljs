define(function (require) {

  var listCtrl = ['$scope',
                  '$stateParams',
                  '$state',
                  'Api',
                  'Entity',
                  '$http',
  function ($scope, $stateParams, $state, Api, Entity, $http) {

    var entity = Entity.getEntity($stateParams.entity);
    var fields = entity.getFields();

    $scope.entityName = entity.name;
    $scope.entityLabel = entity.label;
    $scope.entityFields = [];

    fields.forEach(function (field) {
      if (entity.checkFieldView(field.name, 'list')) {
        $scope.entityFields.push(field);
      }
    });

    $http.get(Api.getBaseApiUrl() + '/' + entity.name)
    .success(function (data, status, headers, config) {
      $scope.entityContent = data;
    });

    $scope.checkShow = function (action) {
      return entity.checkEntityAction(action);
    };

    $scope.deleteItem = function (index) {
      $http.delete(Api.getBaseApiUrl() + '/' + entity.name + '/' + index)
      .success(function (data, status, headers, config) {
        $state.reload();
      });
    };

  }];

  return listCtrl;

});