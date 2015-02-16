angular.module('carnival.components.form-column', [])
.directive('carnivalFormColumn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      field: '=',
      datas: '=',
      state: '@state',
      type: '@'
    },
    templateUrl: 'components/form-column/form-column.html',
    controller: function ($rootScope, $scope, utils, FormService, $element, EntityResources, EntityUpdater, $timeout) {

      var getName = function(){
        return $scope.type + '-' + $scope.entity.name;
      };

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
        return !FormService.columns[getName()];
      };

      $scope.close = function(){
        FormService.closeColumn(getName());
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
