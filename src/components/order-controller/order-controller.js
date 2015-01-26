angular.module('carnival.components.order-controller', [])
.directive('carnivalOrderCtrl', function () {
  return {
    restrict: 'E',
    replate: true,
    scope: {
      field: '='
    },
    templateUrl: 'components/order-controller/order-controller.html',
    controller: function ($scope, urlParams) {
      $scope.toggleOrder = function () {
        var orderDirValue = (urlParams.getParam('order') !== $scope.field) ? 'asc' :
                            (urlParams.getParam('orderDir') === 'asc' && urlParams.getParam('order') === $scope.field) ? 'desc' : 'asc';
        urlParams.setParam('order', $scope.field);
        urlParams.setParam('orderDir', orderDirValue);
        urlParams.reload();
      };
      $scope.checkDirAsc = function () {
        if (urlParams.getParam('order') === $scope.field && urlParams.getParam('orderDir') === 'asc') return true;
        return false;
      };
    }
  };
});
