angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, $state, Configuration, Notification) {

  var entity = $scope.entity = {};
  $scope.relatedResources = {};

  var getRelatedResources = function(resourceName){
    var belongsToField = Configuration.getEntity(resourceName);
    belongsToField.getList().success(function (data, status, headers, config) {
        $scope.relatedResources[resourceName] = data;
      });
  };

  var buildFields = function () {
    for (var i = entity.model.fields.length - 1; i >= 0; i -= 1) {
      var field = entity.model.fields[i];
      if (entity.model.checkFieldView(field.name, 'create')) {
        entity.fields.unshift(field);
        if(field.type == 'belongsTo'){
          getRelatedResources(field.resourceName);
        }
      }
    }
  };

  var onSave = function () {
    entity.model.create(entity.datas)
    .success(function () {
      new Notification(entity.label + ' create with success!', 'success');
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

    buildFields();

    entity.action = {
      label: 'Save',
      click: onSave
    };

  };

  init();

});
