angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, $state, Configuration) {

  var entity = $scope.entity = {};

  var onSave = function () {
    entity.model.create(entity.datas).success(function () {
      $state.go('main.list', { entity: entity.model.name });
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
