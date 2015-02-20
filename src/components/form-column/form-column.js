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
      type: '@',
      index: '@'
    },
    templateUrl: 'components/form-column/form-column.html',
    controller: function ($rootScope, $scope, utils, FormService, $element, EntityResources, EntityUpdater, $timeout, $document) {

      var getName = function(){
        return $scope.type + '-' + $scope.entity.name;
      };

      $timeout(function(){
        $document.scrollTop(0);
        $scope.cssClass = 'fadeInRight';
      }, 10);

      $scope.getDisableClass = function(){
        if(FormService.columnsCount() > parseInt($scope.index) + 1){
          return 'disable-form';
        }
        return '';
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
