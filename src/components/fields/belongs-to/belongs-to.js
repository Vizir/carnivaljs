angular.module('carnival.components.fields.belongsTo', [])
.directive('carnivalBelongsToField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      parentEntity: '=',
      state: '@',
      relatedResources: '='
    },
    templateUrl: 'components/fields/belongs-to/belongs-to.html',
    controller: function($scope){
      $scope.hasNested = function(){
        var viewProp = $scope.field.views[$scope.state];
        return (viewProp && viewProp.nested);
      };
    }
  };
});
