angular.module('carnival')
.controller('ShowController', function ($scope, $stateParams, $state, Configuration, EntityResources) {

  var entity = $scope.entity = {};

  var onEdit = function () {
    $state.go('main.edit', { entity: entity.model.name, id: $stateParams.id });
  };

  var init = function () {
    EntityResources.prepareForListState(entity, $stateParams.entity);

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
