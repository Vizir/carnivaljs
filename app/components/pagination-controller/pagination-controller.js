angular.module('carnival.components.pagination-controller', [])
.directive('carnivalPaginationCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      currentPage: '=',
      totalPages: '='
    },
    templateUrl: 'components/pagination-controller/pagination-controller.html',
    controller: function ($scope, $state, $stateParams) {
      $scope.jumpTo = function (page) {
        $stateParams.page = page;
        $state.go($state.current.name, $stateParams, { reload: true });
      };
      $scope.nextPage = function () {
        if ($scope.currentPage === $scope.totalPages) return;
        $stateParams.page++;
        $state.go($state.current.name, $stateParams, { reload: true });
      };
      $scope.prevPage = function () {
        if ($scope.currentPage === 1) return;
        $stateParams.page--;
        $state.go($state.current.name, $stateParams, { reload: true });
      };
    }
  };
});
