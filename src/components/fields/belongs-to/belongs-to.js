angular.module('carnival.components.fields.belongsTo', [])
.directive('carnivalBelongsToField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      entity: '=',
      state: '@',
      relatedResources: '='
    },
    templateUrl: 'components/fields/belongs-to/belongs-to.html'
  };
});
