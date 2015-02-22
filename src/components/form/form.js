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
      relatedResources: '='
    },
    templateUrl: 'components/form/form.html',
    controller: function (Notification, $document, $scope, utils, FormService, EntityResources, EntityUpdater, $state, $filter) {

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
        if(!$scope.hasRelatedFields())
           return false;
         if($scope.state === 'create')
           return false;
         return true;
      };

      $scope.initSelectedTab = function(index){
        if(!$scope.selectedTab)
          $scope.selectedTab = index;
      };

      $scope.selectTab = function(index){
        $scope.selectedTab = index;
      };

      $scope.getTabClass = function(index){
        if($scope.selectedTab === index)
          return 'active';
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

      var updateEntity = function(data){
        var parentEntity = $scope.entity.parentEntity;
        $scope.entity = EntityResources.prepareForEditState($scope.entity.name, parentEntity);
        $scope.entity.parentEntity = parentEntity;
        updateEntityData(data);
      };

      var goToEdit = function(data){
        var message = $filter('translate')('CREATE_RELATIONS_MESSAGE');
        message = $scope.entity.label + message;
        new Notification(message, 'success');
        if($scope.type === 'normal')
          $state.go('main.edit', { entity: $scope.entity.name, id: data.id});
        else
          $scope.state = 'edit';

        $document.scrollTop(window.innerHeight, 1000);
      };

      var successCallback = function(data){
        $scope.errors = [];
        updateEntity(data);
        if($scope.hasRelatedFields() && $scope.state === 'create'){
          goToEdit(data);
        }else{
          FormService.goToNextStep($scope.entity.name, $scope.type);
          var successMessage = $filter('translate')('UPDATED_SUCCESS_MESSAGE');
          new Notification(successMessage, 'success');
        }
      };

      var saveCallback = function(error, data){
        if(!error){
          successCallback(data);
        }else{
          if(!angular.isArray(data))
            data = [data];
          for(var i = 0; i < data.length; i++){
            new Notification(data[i], 'alert');
          }
        }
      };

      $scope.saveButtonClass = $scope.type === 'nested' ? 'tiny button-submit' : 'small button-submit';

      $scope.buttonAction = function(){
        var callbackFunction = saveCallback;
        $scope.action.click(callbackFunction);
      };
    }
  };
});
