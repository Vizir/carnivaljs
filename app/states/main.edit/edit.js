angular.module('carnival')
.controller('EditController', function ($rootScope, $scope, $stateParams, $state, Configuration, Notification, EntityResources) {

  var entity = $scope.entity = {};
  

  var init = function () {
    $scope.entity = entity = EntityResources.prepareForEditState($stateParams.entity);

    entity.model.getOne($stateParams.id)
    .success(function (data) {
      entity.id = $stateParams.id;
      entity.datas = data;
    });
  };

  init();

});
