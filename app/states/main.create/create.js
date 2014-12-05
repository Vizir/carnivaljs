angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, $state, Configuration, EntityModel) {

  var entity = $scope.entity = {},
      entity_params = Configuration.getEntity($stateParams.entity);

  var buildFields = function () {
    for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
      if (entity.model.checkFieldView(entity.model.fields[i].name, 'create')) {
        entity.fields.unshift(entity.model.fields[i]);
      }
    }
  };

  var init = function () {
    entity.model = new EntityModel(entity_params.name, entity_params.options);
    entity.name = entity.model.name;
    entity.label = entity.model.label;
    entity.fields = [];
    entity.data = {};

    buildFields();
  };

  var onSave = function () {
    entity.model.create(entity.data)
    .success(function () {
      $state.go('main.list', { entity: entity.name });
    });
  };

  entity.action = {
    label: 'Create',
    click: onSave
  };

  init();

});
