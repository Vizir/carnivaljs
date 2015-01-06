angular.module('carnival.components.form', [])
.directive('carnivalForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      fields: '=',
      action: '=',
      state: '@state',
      type: '@',
      datas: '=',
      relatedResources: '=',
      editable: '='
    },
    templateUrl: 'components/form/form.html',
    controller: function ($rootScope, $scope, utils) {
      $scope.utils = utils;

      $scope.buttonAction = function(){
        $scope.action.click();
        if($scope.action.type === 'nested'){
        }
      }
    }
  };
});
