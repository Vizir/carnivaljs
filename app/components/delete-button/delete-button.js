angular.module('carnival.components.delete-button', [])
.directive('carnivalDeleteButton', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      action: '=',
      itemId: '='
    },
    templateUrl: 'components/delete-button/delete-button.html',
    controller: function ($scope, Configuration, EntityModel, $state) {

      $scope.isDeleting = false;

      $scope.start = function () {
        $scope.isDeleting = true;
      };

      $scope.cancel = function () {
        $scope.isDeleting = false;
      };

      $scope.confirm = function () {
        $scope.action($scope.itemId);
      };
    }
  };
});
