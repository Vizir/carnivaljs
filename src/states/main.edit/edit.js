angular.module('carnival')
.controller('EditController', function ($rootScope, $scope, $stateParams, $state, Configuration, EntityResources) {

  var entity = $scope.entity = {};

  var init = function () {
    $scope.entity = entity = EntityResources.prepareForEditState($stateParams.entity);

    entity.model.getOne($stateParams.id)
    .success(function (data) {
      entity.id = $stateParams.id;
      entity.datas = data;
    });
  };

  $scope.show = function(){
    return document.getElementsByClassName('form-column').length > 1;

  }
  var getZIndex = function(){
      return ((document.getElementsByClassName('form-column').length - 1) * 10) + 1;
  }

  var getHeight = function(){
    return (document.querySelector('#master-form').offsetHeight);
  }

  $scope.getStyle = function(){
    return {
      zIndex:  getZIndex(),
      height: getHeight() + 'px'
    };
  }


  init();

});
