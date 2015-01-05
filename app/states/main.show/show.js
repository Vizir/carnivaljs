angular.module('carnival')
.controller('ShowController', function ($scope, $stateParams, $state, Configuration, EntityResources) {

  var entity = $scope.entity = {};

  var init = function () {
    entity = $scope.entity = EntityResources.prepareForShowState(entity, $stateParams.entity);

    entity.model.getOne($stateParams.id)
    .success(function (data) {
      entity.datas = data;
    });

  };

  init();

});
