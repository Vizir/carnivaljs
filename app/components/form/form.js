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
      $scope.canShow = function(field){
        if(field.type != 'hasMany' && field.type != 'belongsTo')
          return true;
        
        if(!$scope.entity.parentEntity)
          return true;
        return false;
      };

      var closeAllNestedForms = function(){
        for(var form in $scope.entity.parentEntity.nestedForms){
          $scope.entity.parentEntity.nestedForms[form].opened = false;
        }
      };

      $scope.buttonAction = function(){
        $scope.action.click();
        if($scope.type === 'nested')
          closeAllNestedForms();
      };
    }
  };
});
