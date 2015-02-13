angular.module('carnival.components.column-form', [])
.directive('carnivalColumnForm', function () {
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
    templateUrl: 'components/column-form/column-form.html',
    controller: function ($rootScope, $scope, utils, FormService, $element, EntityResources, EntityUpdater, $timeout) {

      $scope.cssClass = 'fadeInRight';
      $scope.style = {
        zIndex: (FormService.columnsCount() * 10) + 2,
        left: (FormService.columnsCount() * 20) + 'px',
        top: (FormService.columnsCount() * 30) + 'px',
        padding: '10px'
      };

      $scope.remove = function(){
        $scope.cssClass = 'fadeOutRight';

        $timeout(function(){
          $element.remove();
        }, 1000);
      };

      $scope.isClosed = function(){
        return !FormService.columns[$scope.entity.name];
      };

      $scope.close = function(){
        FormService.closeColumn($scope.entity.name);
      };

      $scope.$watch('isClosed()', function(newValue, oldValue){
        if(newValue === oldValue)
            return;
        if(newValue){
          $scope.remove();
        }
      });
    }
  };
});
