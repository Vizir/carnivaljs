angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, $state, Configuration, Notification, EntityResources) {

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
    EntityResources.prepareForListState(entity, $stateParams.entity);
    entity.action = {
      label: 'Save',
      click: onSave
    };

  };

  init();

});
