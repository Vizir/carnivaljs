define(function () {

  var editCtrl = ['$scope',
                  '$stateParams',
                  '$state',
                  'Entity',
                  'SharedData',
                  'http',
  function ($scope, $stateParams, $state, Entity, SharedData, http) {

    var entity = Entity.getEntity($stateParams.entity);
    var fields = entity.fields;
    var id = $stateParams.id;
    
    $scope.entityName = entity.name;
    $scope.entityLabel = entity.label;
    $scope.entityRelations = entity.relations;
    $scope.entityFields = [];
    
    $scope.save = function () {
      var values = angular.copy($scope.form);
      http.put(entity, id, values).then(function (data) {
        SharedData.notifications.push({ message: 'Success on edit!', type: 'success' });
        $scope.form = data;
      }).catch(function (data) {
        SharedData.notifications.push({ message: data.error.message, type: 'error' });
      });
    };

    fields.forEach(function (field) {
      if (entity.checkFieldView(field.name, 'edit')) {
        $scope.entityFields.push(field);
      }
    });

    http.getOne(entity, id).then(function (data) {
      $scope.form = data;
    }).catch(function (data) {
      SharedData.notifications.push({ message: data.error.message, type: 'error' });
    });

  }];

  return editCtrl;

});