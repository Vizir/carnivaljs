angular.module('carnival')
.controller('ShowController', function ($scope, $stateParams, Configuration, EntityModel) {

  var entity = $scope.entity = {},
      entity_params = Configuration.getEntity($stateParams.entity);

  entity.model = new EntityModel(entity_params.name, entity_params.options);

  entity.id = $stateParams.id;
  entity.name = entity.model.name;
  entity.label = entity.model.label;
  entity.identifier = entity.model.identifier;
  entity.fields = [];
  entity.editable = entity.model.checkAction('edit');

  for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
    if (entity.model.checkFieldView(entity.model.fields[i].name, 'edit')) {
      entity.fields.unshift(entity.model.fields[i]);
    }
  }

  entity.model.getOne(entity.id)
  .success(function (data) {
    entity.datas = data;
  });

  if (entity.model.relations.length > 0) {
    var relations  = {};

    entity.model.relations.forEach(function (rel) {

      var relation_params = Configuration.getEntity(rel.name),
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

      entity.model.getRelList(entity.id, relation.endpoint)
      .success(function (data) {
        relation.datas = data;
      });

    });

    entity.relations = relations;

  }

});
