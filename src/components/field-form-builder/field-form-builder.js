angular.module('carnival.components.field-form-builder', [])
.directive('carnivalFieldFormBuilder', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      parentEntity: '=',
      field: '=',
      data: '=',
      state: '@',
      label: '@'
    },
    templateUrl: 'components/field-form-builder/field-form-builder.html',
    controller: function ($rootScope, $scope, $timeout, utils, $element,  $compile, FormService, Configuration, EntityResources, Notification, $filter, $state) {

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

      var resolveForeignKey = function(entity){
        if(!$scope.parentEntity) return;

        var f = entity.model.getFieldByEntityName($scope.parentEntity.name);

        if(!f) return;

        if(f.type === 'hasMany' || f.type === 'belongsTo'){
          entity.datas[f.foreignKey] = $scope.parentEntity.datas[$scope.parentEntity.identifier];
        }
      };

      $scope._openForm = function(entity, state){
        var containerId = getContainerId(state);

        resolveForeignKey(entity);

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

      $scope.getButtonLabel = function(){
        if($scope.label)
          return $scope.label;

        if($scope.state === 'edit')
          return 'Edit';
      };

      $scope.openWithData = function(){
        var entity = EntityResources.prepareForEditState($scope.field.entityName, $scope.parentEntity);
        var identifier = entity.identifier;
        var id = $scope.data[identifier];
        entity.model.getOne(id)
        .success(function (data) {
          entity[identifier] = id;
          entity.datas = data;
          $scope._openForm(entity, 'edit');
        });
      };

      $scope.open = function(){
        var entity = EntityResources.prepareForCreateState($scope.field.entityName, $scope.parentEntity);
        $scope._openForm(entity, 'create');
      };

      $scope.delete = function (item) {
        var entity = EntityResources.prepareForListState($scope.field.entityName);
        entity.model.delete(item)
        .success(function () {
          var message = $filter('translate')('DELETED_SUCCESS_MESSAGE');
          new Notification(message, 'warning');
          $state.reload();
        })
        .error(function (data) {
          new Notification(data, 'danger');
        });
      };

    }
  };
});
