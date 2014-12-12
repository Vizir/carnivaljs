angular.module('carnival.components.order-controller', [])
.directive('carnivalOrderCtrl', function () {
  return {
    restrict: 'E',
    replate: true,
    scope: {
      field: '='
    },
    templateUrl: 'components/order-controller/order-controller.html',
    controller: function ($scope, $state, $stateParams) {
      $scope.toggleOrder = function () {
        $stateParams.orderDir = ($stateParams.order !== $scope.field) ? 'asc' :
                                ($stateParams.orderDir === 'asc' && $stateParams.order === $scope.field) ? 'desc' : 'asc';
        $stateParams.order = $scope.field;
        $state.go($state.current.name, $stateParams, { reload: true });
      };
      $scope.checkDirAsc = function () {
        if ($stateParams.order === $scope.field && $stateParams.orderDir === 'asc') return true;
        return false;
      };
    }
  };
});
