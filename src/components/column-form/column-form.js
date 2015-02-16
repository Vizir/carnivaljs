angular.module('carnival.components.column-form', [])
.directive('carnivalColumnForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      state: '@state',
      type: '@'
    },
    templateUrl: 'components/column-form/column-form.html',
    controller: function ($scope) {


    }
  };
});
