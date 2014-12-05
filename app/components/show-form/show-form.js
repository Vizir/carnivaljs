angular.module('carnival.components.showform', [])
.directive('carnivalShowForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entityName: '=',
      entityId: '=',
      fields: '=',
      datas: '=',
      relations: '=',
      editable: '='
    },
    templateUrl: 'components/show-form/show-form.html'
  };
});
