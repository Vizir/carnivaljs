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
      FormService.init();

      $scope.getDisableClass = function(){
        if(FormService.columnsCount() > 0)
          return 'disable-form';
        return '';
      };
    }
  };
});
