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
    controller: function (Notification, $document, $scope, utils, FormService, $element, EntityResources, EntityUpdater, $state, $filter) {
      $scope.utils = utils;

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

      var successCallback = function(data){
        $scope.errors = [];
        updateEntity(data);
        if($scope.hasRelatedFields() && $scope.state === 'create'){
          $scope.state = 'edit';
          var message = $filter('translate')('CREATE_RELATIONS_MESSAGE');
          message = $scope.entity.label + message;
          new Notification(message, 'success');
          $document.scrollTop(window.innerHeight, 1000).then(function(){
          });
        }else{
          var successMessage = $filter('translate')('CREATED_SUCCESS_MESSAGE');
          new Notification(successMessage, 'success');
          if($scope.type === 'column')
            FormService.closeColumn('form' + '-' + $scope.entity.name);
          else if($scope.type === 'nested')
            FormService.closeNested($scope.entity.name);
          else
            $state.go('main.list', { entity: $scope.entity.name});
        }
      };

      var saveCallback = function(error, data){
        if(!error){
          successCallback(data);
        }else{
          if(angular.isArray(data))
            $scope.errors = data;
          else
            $scope.errors = [data];
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
