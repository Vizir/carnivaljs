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
        if($scope.type === 'nested'){
          for(var form in $scope.entity.parentEntity.nestedForms){
            $scope.entity.parentEntity.nestedForms[form].opened = false;
          }
        }
      };
    }
  };
});
