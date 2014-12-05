angular.module('carnival')
.controller('ListController', function ($scope, $stateParams, $state, Configuration, EntityModel) {

  var entity = $scope.entity = {},
      entity_params = Configuration.getEntity($stateParams.entity);

  var buildFields = function () {
    for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
      if (!(entity.model.fields[i].type === 'hasMany' ||
            entity.model.fields[i].type === 'belongsTo')) {
        if (entity.model.checkFieldView(entity.model.fields[i].name, 'index')) {
          entity.fields.unshift(entity.model.fields[i]);
        }
      }
    }
  };

  var init = function () {

    entity.model = new EntityModel(entity_params.name, entity_params.options);
    entity.name = entity.model.name;
    entity.label = entity.model.label;
    entity.identifier = entity.model.identifier;
    entity.fields = [];

    buildFields();
  
  };

  init();

  var clickCreate = function () {
    $state.go('main.create', { entity: entity.name });
  };

  var clickEdit = function (id) {
    $state.go('main.edit', { entity: entity.name, id: id });
  };

  var clickShow = function (id) {
    $state.go('main.show', { entity: entity.name, id: id });
  };

  entity.actions = {
    create: {
      label: 'Create',
      click: clickCreate
    },
    edit: {
      label: 'Edit',
      click: clickEdit
    },
    show: {
      label: 'Show',
      click: clickShow
    }
  };

  entity.model.getList()
  .success(function (data, status, headers, config) {
    entity.datas = data;
  });

});
