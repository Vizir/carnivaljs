angular.module('carnival')
.controller('ShowController', function ($scope, $stateParams, $state, Configuration, Notification) {

  var entity = $scope.entity = {};

  new Notification('Release the Kraken!', 'warning');

  var buildFields = function () {
    for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
      if (entity.model.checkFieldView(entity.model.fields[i].name, 'show')) {
        entity.fields.unshift(entity.model.fields[i]);
      }
    }
  };

  var onEdit = function () {
    $state.go('main.edit', { entity: entity.model.name, id: $stateParams.id });
  };

  var init = function () {
    entity.model = Configuration.getEntity($stateParams.entity);
    entity.label = entity.model.label;
    entity.fields = [];
    entity.datas = {};

    buildFields();

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
