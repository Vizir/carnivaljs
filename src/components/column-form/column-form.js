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
      zIndex: '@',
      datas: '=',
      relatedResources: '=',
      editable: '='
    },
    templateUrl: 'components/column-form/column-form.html',
    controller: function ($rootScope, $scope, utils, FormService, $element, EntityResources, EntityUpdater, $timeout) {

      $scope.cssClass = 'fadeInRight';
      $scope.style = {
        zIndex: $scope.zIndex,
        padding: '50px'
      };

      $scope.remove = function(){
        $scope.cssClass = 'fadeOutRight';

        $timeout(function(){
          $element.remove()
        }, 1000);
      }
    }
  };
});
