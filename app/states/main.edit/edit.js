angular.module('carnival')
.controller('EditController', function ($scope, $stateParams, $state, Configuration, Notification) {

  var entity = $scope.entity = {};

  var onSave = function () {
    entity.model.update($stateParams.id, entity.datas)
    .success(function () {
      new Notification('Modifications saved with success!', 'success');
      $state.go('main.show', { entity: entity.model.name, id: $stateParams.id });
    })
    .error(function (data) {
      new Notification(data, 'danger');
    });
  };

  var init = function () {
    entity.model = Configuration.getEntity($stateParams.entity);
    entity.label = entity.model.label;
    entity.fields = [];
    entity.datas = {};
  
    $scope.buildFieldsForState({state: 'edit', entity: entity});

    entity.action = {
      label: 'Save',
      click: onSave
    };

    entity.model.getOne($stateParams.id)
    .success(function (data) {
      entity.datas = data;
    });
  };

  init();

});
