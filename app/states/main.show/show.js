angular.module('carnival')
.controller('ShowController', function ($scope, $stateParams, $state, Configuration, EntityResources) {

  var entity = $scope.entity = {};

  $scope.buttonAction = function(){
    $state.go('main.edit', { entity: entity.name, id: entity.datas.id });
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
