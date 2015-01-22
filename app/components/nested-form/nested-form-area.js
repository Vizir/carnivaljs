angular.module('carnival.components.nested-form-area', [])
.directive('carnivalNestedFormArea', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      field: '=',
      state: '@',
      datas: '=',
      relationType: '@',
      editable: '='
    },
    templateUrl: 'components/nested-form/nested-form-area.html',
    controller: function ($rootScope, $scope, utils, $element,  $compile, FormService) {

      $scope.canOpenNestedForm = function(){
        if(!$scope.entity.nestedForms[$scope.field.endpoint])
          return false;

        if($scope.state === 'create')
          return false;

        return true;
      };

      $scope.open = function(){
        if(FormService.isNestedOpen($scope.field.entityName))
          return;
        FormService.openNested($scope.field.entityName);
        var directive = '<carnival-nested-form type="nested" entity="entity.nestedForms[field.endpoint]"></carnival-nested-form></div>';
        var newElement = $compile(directive)($scope);
        var nestedDiv = document.querySelector('#nesteds_'+$scope.field.entityName);
        angular.element(nestedDiv).append(newElement);
      };

      $scope.isHasMany = function(){
        return $scope.relationType === 'hasMany';
      };



    }
  };
});
