angular.module('carnival.components.nested-form', [])
.directive('carnivalNestedForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      state: '@',
      editable: '='
    },
    templateUrl: 'components/relation-field-area/nested-form.html',
    controller: function ($rootScope, $scope, utils, $element, FormService) {

      $scope.isClosed = function(){
        return !FormService.nesteds[$scope.entity.name];
      };

      $scope.close = function(){
        FormService.closeNested($scope.entity.name);
      };

      $scope.$watch('isClosed()', function(newValue, oldValue){
        if(newValue === oldValue)
            return;
        if(newValue){
          $element.remove();
        }
      });
    }
  };
});
