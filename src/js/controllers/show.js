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

    $scope.checkShow = function (action) {
      return entity.checkEntityAction(action);
    };

    $scope.edit = function () {
      $state.go('main.edit', { entity: entity.name, id: id }, {reload: true});
    };

    fields.forEach(function (field) {
      if (entity.checkFieldView(field.name, 'show')) {
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