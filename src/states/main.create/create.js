angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, $state, Configuration, Notification, EntityResources) {

  var entity = $scope.entity = {};


  var init = function () {
    $scope.entity = EntityResources.prepareForCreateState($stateParams.entity);
    entity = $scope.entity;
  };

  init();

});
