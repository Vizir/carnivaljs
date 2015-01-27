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
    controller: function ($rootScope, $scope, utils, FormService, $element, EntityResources) {
      $scope.utils = utils;

      if($scope.type !== 'nested'){
        FormService.init();
      }

      $scope.canShow = function(field){
        if(field.type != 'hasMany' && field.type != 'belongsTo')
          return true;

        if($scope.type !== 'nested')
          return true;

        if($scope.entity.parentEntity.name !== field.entityName)
            return true;

        return false;
      };

      var saveCallbackForNested = function(error, data){
        if(Object.keys($scope.entity.nestedForms).length > 0){

          if($scope.state === 'edit')
            FormService.closeNested($scope.entity.name);

          $scope.entity = EntityResources.prepareForEditState($scope.entity.name);
          var identifier = $scope.entity.identifier;
          $scope.entity[identifier] = data[identifier];
          $scope.state = 'edit';
          $scope.entity.datas = data;
        }else{
          FormService.closeNested($scope.entity.name);
        }
      };

      $scope.buttonAction = function(){
        var callbackFunction = null;
        if($scope.type === 'nested'){
          FormService.saveNested($scope.entity.name);
          callbackFunction = saveCallbackForNested;
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
