angular.module('carnival.components.form', [])
.directive('carnivalForm', function () {
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
    templateUrl: 'components/form/form.html',
    controller: function ($rootScope, $scope, utils, FormService, $element, EntityResources, EntityUpdater, $state) {
      $scope.utils = utils;

      if($scope.type === 'normal'){
        FormService.init();
      }

      $scope.hasRelatedFields = function(){
        for(var i = 0; i < $scope.fields.length; i++){
          var field = $scope.fields[i];
          if(field.fieldFormType !== 'related')
            continue;
          return true;
        }
        return false;
      };

      $scope.showRelatedFields = function(){
        if($scope.type === 'normal')
          return true;
        return $scope.hasRelatedFields();
      };

      $scope.canShow = function(field){
       return FormService.canShowThisField($scope.entity, $scope.state, field);
      };

      var entityHasNesteds = function(){
        return ($scope.entity.nestedForms && Object.keys($scope.entity.nestedForms).length > 0);
      };

      var updateEntity = function(){
        var parentEntity = $scope.entity.parentEntity;
        $scope.entity = EntityResources.prepareForEditState($scope.entity.name);
        $scope.entity.parentEntity = parentEntity;
      };

      var updateEntityData = function(data){
        var parentEntity = $scope.entity.parentEntity;
        var identifier = $scope.entity.identifier;
        $scope.entity[identifier] = data[identifier];
        $scope.entity.datas = data;
        if(!parentEntity)
          return;
        var fieldToUpdate = parentEntity.model.getFieldByEntityName($scope.entity.name);
        EntityUpdater.updateEntity(parentEntity, fieldToUpdate, data);
      };

      var saveCallback = function(error, data){
        if(!error){
          updateEntity();
          updateEntityData(data);
          if($scope.hasRelatedFields() && $scope.state === 'create'){
            $scope.state = 'edit';
            alert('Agora você pode criar os campos relacionados');
          }else{
            if($scope.type === 'column')
              $scope.$parent.remove();
            else if($scope.type === 'nested')
              FormService.closeNested($scope.entity.name);
            else
              $state.go('main.list', { entity: $scope.entity.name});
          }
        }
      };

      $scope.buttonAction = function(){
        var callbackFunction = saveCallback;
        $scope.action.click(callbackFunction);
      };
    }
  };
});
