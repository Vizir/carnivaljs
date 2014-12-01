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
    var relations = entity.relations;

    var id = $stateParams.id;
    
    $scope.entityName = entity.name;
    $scope.entityLabel = entity.label;
    $scope.entityFields = [];
    $scope.entityData = [];

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
      $scope.entityData = data;
    }).catch(function (data) {
      SharedData.notifications.push({ message: data.error.message, type: 'error' });
    });

    if (relations.length > 0) {

      var relationsFields = {};
      var relationsDatas = {};

      relations.forEach(function (relation) {

        var relationEntity = Entity.getEntity(relation.name);

        relationsFields[relationEntity.name] = angular.copy(relationEntity.fields);

        for (var i = relationsFields[relationEntity.name].length - 1; i >= 0; i -= 1) {
          if (relationsFields[relationEntity.name][i].type === 'hasMany' ||
              relationsFields[relationEntity.name][i].type === 'belongsTo') {
            relationsFields[relationEntity.name].splice(i, 1);
          }
        }

        http.getRel(entity, id, relation.endpoint).then(function (data) {
          relationsDatas[relationEntity.name] = data;
        }).catch(function (data) {
          SharedData.notifications.push({ message: data.error.message, type: 'error' });
        });

      });

      $scope.relationsFields = relationsFields;
      $scope.relationsDatas = relationsDatas;

    }

  }];

  return editCtrl;

});