define(function (require) {

  var listCtrl = ['$scope',
                  '$stateParams',
                  '$state',
                  'Entity',
                  'SharedData',
                  'http',
  function ($scope, $stateParams, $state, Entity, SharedData, http) {

    var entity = Entity.getEntity($stateParams.entity);
    var fields = entity.fields;

    $scope.entityName = entity.name;
    $scope.entityIdentifier = entity.identifier;
    $scope.entityLabel = entity.label;
    $scope.entityFields = [];
    
    $scope.checkShow = function (action) {
      return entity.checkEntityAction(action);
    };

    $scope.deleteItem = function (index) {
      http.destroy(entity, index).then(function () {
        SharedData.notifications.push({ message: 'Success on delete!', type: 'success'});
        $state.reload();
      }).catch(function (data) {
        SharedData.notifications.push({ message: data.error.message, type: 'error'});
      });
    };

    fields.forEach(function (field) {
      if (entity.checkFieldView(field.name, 'list')) {
        $scope.entityFields.push(field);
      }
    });

    http.get(entity).then(function (data, status, headers, config) {
      $scope.entityContent = data;
    }).catch(function (data, status, headers, config) {
      SharedData.notifications.push({ message: data.error.message, type: 'error'});
    });

  }];

  return listCtrl;

});