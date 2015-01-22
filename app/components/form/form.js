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

      $scope.buttonAction = function(){

        if($scope.type !== 'nested'){
          if(FormService.hasUnsavedNested()){
            console.log('Não é possivel salvar o form pois existem nested não salvos');
            return;
          }
        }else{
          FormService.saveNested($scope.entity.name);
        }

        $scope.action.click(function(error, data){

          if(error){
            console.log('Aconteceu um erro ao salvar');
          }else{
            console.log('Salvo com sucesso, dados: ', data);
            if(Object.keys($scope.entity.nestedForms).length > 0){
              if($scope.state === 'edit' && $scope.type === 'nested'){
                FormService.closeNested($scope.entity.name);
              }
              $scope.state = 'edit';
              $scope.entity.datas = data;
            }else{
              if($scope.type === 'nested')
                  FormService.closeNested($scope.entity.name);
            }

          }
        });
      };
    }
  };
});
