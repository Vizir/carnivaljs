angular.module('carnival')
.controller('EditController', function ($scope, $stateParams, $state, Configuration) {

  var entity = $scope.entity = {};

  var onSave = function () {
    entity.model.update($stateParams.id, entity.datas).success(function () {
      $state.go('main.show', { entity: entity.model.name, id: $stateParams.id });
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
