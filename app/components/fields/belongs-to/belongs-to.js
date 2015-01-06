angular.module('carnival.components.fields.belongsTo', [])
.directive('carnivalBelongsToField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      entity: '=',
      nestedFormType: '=',
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
    controller: function ($rootScope, $scope, utils) {
      $scope.utils = utils;

      $scope.open = function(index){
        $rootScope["nested_form_"+ $scope.entity.model.name + "_" + index + "_opened"] = true;
      };

    }
  };
});
