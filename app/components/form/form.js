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
    controller: function ($rootScope, $scope, utils, FormService) {
      $scope.utils = utils;
      var init = function(){
        $scope.id = new Date().getTime();
        if($scope.type === 'nested')
          FormService.openNested($scope.id);
      };

      $scope.canShow = function(field){
        if(field.type != 'hasMany' && field.type != 'belongsTo')
          return true;

        if(!$scope.entity.parentEntity)
          return true;
        return false;
      };

      $scope.buttonAction = function(){

        if($scope.type !== 'nested'){
          if(FormService.hasUnsavedNested()){
            console.log('Não é possivel salvar o form pois existem nested não salvos');
            return;
          }
        }else{
          FormService.saveNested($scope.id);
        }

        $scope.action.click(function(error, data){
          if(error){
            console.log('Aconteceu um erro ao salvar');
          }else{
            console.log('Salvo com sucesso, dados: ', data);
            $scope.entity.hasUnfinishedForms = false;
            $scope.state = 'edit';
            $scope.entity.datas = data;
          }
        });
      };
      init();
    }
  };
});
