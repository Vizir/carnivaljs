angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, $state, Configuration) {

  var entity = $scope.entity = {};

  var buildFields = function () {
    for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
      if (entity.model.checkFieldView(entity.model.fields[i].name, 'create')) {
        entity.fields.unshift(entity.model.fields[i]);
      }
    }
  };

  var onSave = function () {
    entity.model.create(entity.data).success(function () {
      $state.go('main.list', { entity: entity.name });
    });
  };

  var init = function () {
    entity.model = Configuration.getEntity($stateParams.entity);
    entity.label = entity.model.label;
    entity.fields = [];
    entity.datas = {};

    buildFields();

    entity.action = {
      label: 'Create',
      click: onSave
    };
  };

  init();

});
