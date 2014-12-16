angular.module('carnival')
.controller('ShowController', function ($scope, $stateParams, $state, Configuration) {

  var entity = $scope.entity = {};

  var onEdit = function () {
    $state.go('main.edit', { entity: entity.model.name, id: $stateParams.id });
  };

  var init = function () {
    entity.model = Configuration.getEntity($stateParams.entity);
    entity.label = entity.model.label;
    entity.fields = [];
    entity.datas = {};

    $scope.buildFieldsForState({state: 'show', entity: entity});

    entity.action = {
      label: 'Edit',
      click: onEdit
    };

    entity.model.getOne($stateParams.id)
    .success(function (data) {
      entity.datas = data;
    });

  };

  init();

});
