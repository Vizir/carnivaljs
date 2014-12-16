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
    controller: function ($scope, urlParams) {
      $scope.jumpTo = function (page) {
        urlParams.setFilter('page', page, true);
      };
      $scope.nextPage = function () {
        if ($scope.currentPage === $scope.totalPages) return;
        urlParams.setFilter('page', $scope.currentPage++, true);
      };
      $scope.prevPage = function () {
        if ($scope.currentPage === 1) return;
        urlParams.setFilter('page', $scope.currentPage--, true);
      };
    }
  };
});
