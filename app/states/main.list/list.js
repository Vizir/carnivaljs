angular.module('carnival')
.controller('ListController', function ($scope, $stateParams, $state, Configuration) {

  var entity = $scope.entity = {};

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

  var onCreate = function () {
    $state.go('main.create', { entity: entity.name });
  };

  var onEdit = function (id) {
    $state.go('main.edit', { entity: entity.name, id: id });
  };

  var onShow = function (id) {
    $state.go('main.show', { entity: entity.name, id: id });
  };

  var onDelete = function (id) {
    entity.model.delete(id);
    $state.reload();
  };

  var init = function () {
    entity.model = Configuration.getEntity($stateParams.entity);
    entity.name = entity.model.name;
    entity.label = entity.model.label;
    entity.identifier = entity.model.identifier;
    entity.fields = [];
    entity.datas = [];

    buildFields();

    entity.actions = {
      create: {
        label: 'Create',
        click: onCreate
      },
      edit: {
        label: 'Edit',
        click: onEdit
      },
      show: {
        label: 'Show',
        click: onShow
      },
      delete: {
        click: onDelete
      }
    };

    entity.model.getList()
    .success(function (data, status, headers, config) {
      entity.datas = data;
    });

  };

  init();

});
