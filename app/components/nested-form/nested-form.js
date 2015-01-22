angular.module('carnival.components.nested-form', [])
.directive('carnivalNestedForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      editable: '='
    },
    templateUrl: 'components/nested-form/nested-form.html',
    controller: function ($rootScope, $scope, utils) {

    }
  };
});
