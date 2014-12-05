angular.module('carnival.controllers')
.controller('ListController', function ($scope, $stateParams, $state, Entity, EntityModel) {

  var entity = $scope.entity = {},
      entity_params = Entity.getEntity($stateParams.entity);

  entity.model = new EntityModel(entity_params.name, entity_params.options);
  entity.name = entity.model.name;
  entity.label = entity.model.label;
  entity.identifier = entity.model.identifier;
  entity.fields = [];

  for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
    if (!(entity.model.fields[i].type === 'hasMany' ||
          entity.model.fields[i].type === 'belongsTo')) {
      if (entity.model.checkFieldView(entity.model.fields[i].name, 'index')) {
        entity.fields.unshift(entity.model.fields[i]);
      }
    }
  }

  var clickCreate = function () {
    $state.go('main.create({ entity:' + entity.name + '})');
  };

  entity.actions = {
    label: 'Create',
    click: clickCreate
  };

  entity.model.getList()
  .success(function (data, status, headers, config) {
    entity.datas = data;
  });

});
