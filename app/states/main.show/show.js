angular.module('carnival')
.controller('ShowController', function ($scope, $stateParams, $state, Configuration, EntityModel) {

  var entity = $scope.entity = {},
      entity_params = Configuration.getEntity($stateParams.entity);

  var buildFields = function () {
    for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
      if (entity.model.checkFieldView(entity.model.fields[i].name, 'show')) {
        entity.fields.unshift(entity.model.fields[i]);
      }
    }
  };

  var init = function () {
    entity.model = new EntityModel(entity_params.name, entity_params.options);
    entity.label = entity.model.label;
    entity.fields = [];
    buildFields();
  };

  init();

  var onEdit = function () {
    $state.go('main.edit', { entity: entity.model.name, id: $stateParams.id });
  };

  entity.action = {
    label: 'Edit',
    click: onEdit
  };

  entity.model.getOne($stateParams.id)
  .success(function (data) {
    entity.datas = data;
  });

});
