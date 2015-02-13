angular.module('carnival')
.controller('CreateController', function ($scope, $stateParams, $state, Configuration, Notification, EntityResources) {

  var entity = $scope.entity = {};


  var init = function () {
    $scope.entity = EntityResources.prepareForCreateState($stateParams.entity);
    entity = $scope.entity;
  };

  $scope.show = function(){
    return document.getElementsByClassName('form-column').length > 1;

  };
  var getZIndex = function(){
    return ((document.getElementsByClassName('form-column').length - 1) * 10) + 3;
  };

  var getHeight = function(){
    return (document.querySelector('#master-form').offsetHeight);
  };

  $scope.getStyle = function(){
    return {
      zIndex:  getZIndex(),
      height: getHeight() + 'px'
    };
  };

  init();

});
