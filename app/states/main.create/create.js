angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, $state, Configuration, Notification) {

  var entity = $scope.entity = {};

  var onSave = function () {
    entity.model.create(entity.datas)
    .success(function () {
      new Notification('Item created with success!', 'success');
      $state.go('main.list', { entity: entity.model.name });
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

    $scope.buildFieldsForState({state: 'create', entity: entity});

    entity.action = {
      label: 'Save',
      click: onSave
    };

  };

  init();

});
