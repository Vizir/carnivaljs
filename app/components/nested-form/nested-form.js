angular.module('carnival.components.nested-form', [])
.directive('carnivalNestedForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      editable: '='
    },
    templateUrl: 'components/nested-form/nested-form.html',
    controller: function ($rootScope, $scope, utils, $element, FormService) {

      $scope.isClosed = function(){
        return !FormService.nesteds[$scope.entity.name];
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
