angular.module('carnival.components.field-form-builder', [])
.directive('carnivalFieldFormBuilder', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      parentEntity: '=',
      field: '=',
      data: '=',
      state: '@'
    },
    templateUrl: 'components/field-form-builder/field-form-builder.html',
    controller: function ($rootScope, $scope, $timeout, utils, $element,  $compile, FormService, Configuration, EntityResources, Notification) {

      var getContainerId = function(state){
        var nestedType = $scope.field.views[state].nested;
        if(nestedType.type === 'column'){
          return '#form-columns';
        }else{
          var prefix = '';
          if(state === 'edit' )
            prefix = '_' + $scope.data[$scope.field.identifier];
          return '#'+state+'_nested_'+ $scope.field.entityName +  prefix;
        }
      };

      $scope._openForm = function(entity, state){
        var containerId = getContainerId(state);
        entity.datas = $scope.data || {};

        var formScope = $scope.$new();
        formScope.entity = entity;
        formScope.state = state;

        var nestedType = $scope.field.views[state].nested;
        if(nestedType.type === 'column'){
          FormService.openColumn(state, containerId, formScope);
        }else{
          FormService.openNested(state, containerId, formScope);
        }
      };

      $scope.openWithData = function(){
        var state = 'edit';
        var entity = EntityResources.prepareForEditState($scope.field.entityName, $scope.parentEntity);
        var identifier = entity.identifier;
        entity[identifier] = $scope.data[identifier];
        $scope._openForm(entity, 'edit');
      };

      $scope.open = function(){
        var state = 'create';
        var entity = EntityResources.prepareForCreateState($scope.field.entityName, $scope.parentEntity);
        $scope._openForm(entity, 'create');
      };
    }
  };
});
