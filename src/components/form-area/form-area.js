angular.module('carnival.components.form-area', [])
.directive('carnivalFormArea', function () {
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
    templateUrl: 'components/form-area/form-area.html',
    controller: function ($rootScope, $scope, utils, FormService, $element, EntityResources, EntityUpdater, $state) {
      $scope.show = function(){
        return FormService.columnsCount() > 1;

      };
      var getZIndex = function(){
        return ((FormService.columnsCount() - 1) * 10) + 3;
      };

      var getHeight = function(){
        return (document.querySelector('#master-form').offsetHeight);
      };

      $scope.getStyle = function(){
        return {
          zIndex:  getZIndex(),
          height: getHeight() + 'px'
        };
      };

    }
  };
});
