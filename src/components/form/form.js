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
    controller: function ($rootScope, $scope, utils, FormService, $element, EntityResources, EntityUpdater) {
      $scope.utils = utils;

      if($scope.type !== 'nested'){
        FormService.init();
      }

      $scope.hasRelatedFields = function(){
        for(var i = 0; i < $scope.fields; i++){
          var field = $scope.fields[i];
          if(field.fieldFormType !== 'related')
            continue;
          if(!$scope.canShow(field))
            continue;
          return true;
        }
        return false;
      }

      $scope.showRelatedFields = function(){
        if($scope.type === 'normal')
          return true;
        return $scope.hasRelatedFields();
      }

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
        var fieldToUpdate = parentEntity.model.getFieldByEntityName($scope.entity.name);
        EntityUpdater.updateEntity(parentEntity, fieldToUpdate, data);
        var identifier = $scope.entity.identifier;
        $scope.entity[identifier] = data[identifier];
        $scope.state = 'edit';
        $scope.entity.datas = data;
      };

      var saveCallbackForNested = function(error, data){
        if(!error){
          if($scope.state === 'edit' || !entityHasNesteds())
            FormService.closeNested($scope.entity.name);
          updateEntity();
          updateEntityData(data);
        }
      };

      var saveCallbackForColumn = function(error, data){
        if(!error){
          updateEntity();
          updateEntityData(data);
          $scope.$parent.remove();
        }
      }

      $scope.buttonAction = function(){
        var callbackFunction = null;
        if($scope.type === 'nested'){
          FormService.saveNested($scope.entity.name);
          callbackFunction = saveCallbackForNested;
        }else if($scope.type === 'column'){
          callbackFunction = saveCallbackForColumn;
        }else{
          if(FormService.hasUnsavedNested()){
            console.log('Não é possivel salvar o form pois existem nested não salvos');
            return;
          }
        }

        $scope.action.click(callbackFunction);
      };
    }
  };
});
