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
        var orderDirValue = (urlParams.getFilter('order') !== $scope.field) ? 'asc' :
                            (urlParams.getFilter('orderDir') === 'asc' && urlParams.getFilter('order') === $scope.field) ? 'desc' : 'asc';
        urlParams.setFilter('orderDir', orderDirValue);
        urlParams.setFilter('order', $scope.field);
        urlParams.reload();
      };
      $scope.checkDirAsc = function () {
        if (urlParams.getFilter('order') === $scope.field && urlParams.getFilter('orderDir') === 'asc') return true;
        return false;
      };
    }
  };
});
