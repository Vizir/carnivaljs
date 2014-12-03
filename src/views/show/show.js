angular.module('carnival.controllers')
.controller('ShowController', ['$scope', '$stateParams', 'Entity', 'EntityModel', function ($scope, $stateParams, Entity, EntityModel) {

  var entity = $scope.entity = {},
      entity_params = Entity.getEntity($stateParams.entity);

  entity.model = new EntityModel(entity_params.name, entity_params.options);

  entity.name = entity.model.name;
  entity.label = entity.model.label;
  entity.identifier = entity.model.identifier;
  entity.fields = [];

  for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
    if (entity.model.checkFieldView(entity.model.fields[i].name, 'edit')) {
      entity.fields.unshift(entity.model.fields[i]);
    }
  }

  entity.model.getOne($stateParams.id)
  .success(function (data) {
    entity.datas = data;
  });

  if (entity.model.relations.length > 0) {
    var relations = $scope.relations = {};

    entity.model.relations.forEach(function (rel) {

      var relation_params = Entity.getEntity(rel.name),
          relation = relations[relation_params.name] = {};
      
      relation.model = new EntityModel(relation_params.name, relation_params.options);
      relation.endpoint = rel.endpoint;
      relation.name = relation.model.name;
      relation.label = relation.model.label;
      relation.identifier = relation.model.identifier;
      relation.fields = [];

      for (var j = relation.model.fields.length - 1; j >= 0; j -= 1) {
        if (!(relation.model.fields[j].type === 'hasMany' ||
            relation.model.fields[j].type === 'belongsTo')) {
          relation.fields.unshift(relation.model.fields[j]);
        }
      }

      entity.model.getRelList($stateParams.id, relation.endpoint)
      .success(function (data) {
        relation.datas = data;
        console.log(data);
      });

    });
    
    entity.relations = relations;

  }


  // $scope.checkShow = function (action) {
  //   return entity.checkEntityAction(action);
  // };

  // $scope.edit = function () {
  //   $state.go('main.edit', { entity: entity.name, id: id }, {reload: true});
  // };

  // fields.forEach(function (field) {
  //   if (entity.checkFieldView(field.name, 'show')) {
  //     $scope.entityFields.push(field);
  //   }
  // });

  // http.getOne(entity, id).then(function (data) {
  //   $scope.entityData = data;
  // }).catch(function (data) {
  //   SharedData.notifications.push({ message: data.error.message, type: 'error' });
  // });

  // if (relations.length > 0) {

  //   var relationsFields = {};
  //   var relationsDatas = {};

  //   relations.forEach(function (relation) {

  //     var relationEntity = Entity.getEntity(relation.name);

  //     relationsFields[relationEntity.name] = angular.copy(relationEntity.fields);

  //     for (var i = relationsFields[relationEntity.name].length - 1; i >= 0; i -= 1) {
  //       if (relationsFields[relationEntity.name][i].type === 'hasMany' ||
  //           relationsFields[relationEntity.name][i].type === 'belongsTo') {
  //         relationsFields[relationEntity.name].splice(i, 1);
  //       }
  //     }

  //     http.getRel(entity, id, relation.endpoint).then(function (data) {
  //       relationsDatas[relationEntity.name] = data;
  //     }).catch(function (data) {
  //       SharedData.notifications.push({ message: data.error.message, type: 'error' });
  //     });

  //   });

  //   $scope.relationsFields = relationsFields;
  //   $scope.relationsDatas = relationsDatas;

  // }

}]);