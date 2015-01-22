angular.module('carnival.components.fields.belongsTo', [])
.directive('carnivalBelongsToField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      entity: '=',
      nestedFormIndex: '=',
      relatedResources: '=',
      editable: '='
    },
    templateUrl: 'components/fields/belongs-to/belongs-to.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    },
    controller: function ($rootScope, $scope, utils, $compile, $element) {
      $scope.utils = utils;

      $scope.canShowNestedForm = function(field){
        if(!$scope.entity.nestedForms[field.endpoint])
          return false;

        if(!$scope.entity.datas[field.identifier])
          return false;
        return true;
      };

      $scope.open = function(index){
        var directive = '<carnival-nested-form type="nested" entity="entity.nestedForms[field.endpoint]"></carnival-nested-form></div>';
        var newElement = $compile(directive)($scope);
        var nestedDiv = document.querySelector('#nesteds_'+$scope.field.entityName);
        angular.element(nestedDiv).append(newElement);
      };
    }
  };
});
