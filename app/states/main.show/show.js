angular.module('carnival')
.controller('ShowController', function ($scope, $stateParams, $state, Configuration, EntityResources) {

  var entity = $scope.entity = {};

  $scope.buttonAction = function(){
    $state.go('main.edit', { entity: entity.name, id: entity.datas.id });
  };

  $scope.getValue = function (item, field) {
    for (var i = 0, x = field.values.length; i < x; i += 1) {
      if (field.values[i].value === item) {
        return field.values[i].label;
      }
    }
  };

  var init = function () {
    entity = $scope.entity = EntityResources.prepareForShowState($stateParams.entity);

    entity.model.getOne($stateParams.id)
    .success(function (data) {
      entity.datas = data;
    });

  };

  init();

});
