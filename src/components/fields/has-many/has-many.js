angular.module('carnival.components.fields.hasMany', [])
.directive('carnivalHasManyField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      state: '@',
      entity: '=',
      relatedResources: '='
    },
    templateUrl: 'components/fields/has-many/has-many.html',
    controller: function ($rootScope, $scope, utils, Configuration, $compile, $element, $document, FormService) {
      $scope.utils = utils;

      $scope.canShow = function(){
        return FormService.canShowThisHasManyField($scope.entity, $scope.state, $scope.field);
      };

      var getItemIndex = function(id, items){
        for(var i = 0; i < items.length; i++){
          if(items[i].id === id)
            return i;
        }
        return -1;
      };

      var getSelectedItem = function(){
        var items = $scope.relatedResources[$scope.field.name];
        var index = getItemIndex($scope.selectedHasMany, items);
        if(index >= 0)
          return items[index];
      };

      var getZIndex = function(){
        return (document.getElementsByClassName('form-column').length * 10) + 2;
      }

      $scope.addColumn = function(){
        $document.scrollTop(0, 1000).then(function(){
          $scope.relatedEntity = $scope.entity.nestedForms[$scope.field.endpoint];
          var directive = '<carnival-column-form  entity="relatedEntity" z-index="'+getZIndex()+'" fields="relatedEntity.fields" datas="relatedEntity.datas" action="relatedEntity.action" state="edit" related-resources="relatedEntity.relatedResources" editable="true"></carnival-column-form>';
          var newElement = $compile(directive)($scope);
          var nestedDiv = document.querySelector('#form-columns');
          angular.element(nestedDiv).append(newElement);
        });
      };

      $scope.addHasManyOption = function(){
        var selectedItem = getSelectedItem();
        if(!$scope.datas[$scope.field.name])
          $scope.datas[$scope.field.name] = [];
        if(selectedItem){
          $scope.datas[$scope.field.name].push(selectedItem);
        }
      };

    }
  };
});
