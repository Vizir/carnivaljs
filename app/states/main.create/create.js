angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, Configuration, EntityModel) {

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
    entity.label = entity.model.label;
    entity.fields = [];

    buildFields();
  };

  var onSave = function () {
    console.log('Save!');
  };

  entity.action = {
    label: 'Create',
    click: onSave
  };


  init();

});
