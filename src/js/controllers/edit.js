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

    console.log(fields);

    var id = $stateParams.id;
    
    $scope.entityName = entity.name;
    $scope.entityLabel = entity.label;
    $scope.entityFields = [];
    
    $scope.form = {};

    $scope.save = function () {
      var values = angular.copy($scope.form);
      http.put(entity, id, values).then(function (data) {
        SharedData.notifications.push({ message: 'Success on edit!', type: 'success' });
        $state.go('main.show', { entity: entity.name, id: id }, {reload: true});
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

    if (relations.length > 0) {

      var relationsFields = {};
      var relationsDatas = {};
      var relationSelDatas = {};

      relations.forEach(function (relation) {

        var relationEntity = Entity.getEntity(relation.name);

        relationsFields[relationEntity.name] = angular.copy(relationEntity.fields);

        for (var i = relationsFields[relationEntity.name].length - 1; i >= 0; i -= 1) {
          if (relationsFields[relationEntity.name][i].type === 'hasMany' ||
              relationsFields[relationEntity.name][i].type === 'belongsTo') {
            relationsFields[relationEntity.name].splice(i, 1);
          }
        }
      
        http.get(relationEntity).then(function (data) {
          relationsDatas[relationEntity.name] = data;
        }).catch(function (data) {
          SharedData.notifications.push({ message: data.error.message, type: 'error' });
        });

        http.getRel(entity, id, relation.endpoint).then(function (data) {
          relationSelDatas[relationEntity.name] = data;
        }).catch(function (data) {
          SharedData.notifications.push({ message: data.error.message, type: 'error' });
        });

      });

      $scope.relationsFields = relationsFields;
      $scope.relationsDatas = relationsDatas;
      $scope.relationSelDatas = relationSelDatas;

    }

  }];

  return editCtrl;

});