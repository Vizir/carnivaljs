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
    controller: function ($rootScope, $scope, utils, FormService, $element) {
      $scope.utils = utils;

      $scope.canShow = function(field){
        if(field.type != 'hasMany' && field.type != 'belongsTo')
          return true;

        if(!$scope.entity.parentEntity)
          return true;

        if($scope.entity.parentEntity.name !== field.entityName)
            return true;

        return false;
      };

      $scope.buttonAction = function(){
        if($scope.type === 'nested'){
          FormService.saveNested($scope.entity.name);
        }else{
          if(FormService.hasUnsavedNested()){
            console.log('Não é possivel salvar o form pois existem nested não salvos');
            return;
          }
        }

        var successSaveCallback = function(data){
          if(Object.keys($scope.entity.nestedForms).length > 0){

            if($scope.state === 'edit')
              FormService.closeNested($scope.entity.name);

            $scope.state = 'edit';
            $scope.entity.datas = data;
          }else{
            FormService.closeNested($scope.entity.name);
          }
        }

        $scope.action.click(function(error, data){
          if(error){
            console.log('Aconteceu um erro ao salvar');
          }else{
            if($scope.type === 'nested')
              successSaveCallback(data);
          }
        });
      };
    }
  };
});
