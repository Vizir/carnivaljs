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
    controller: function ($scope, $rootScope, urlParams) {
      $scope.jumpTo = function (page) {
        urlParams.setParam('page', page, true);
      };
      $scope.nextPage = function () {
        if ($scope.currentPage === $scope.totalPages) return;
        urlParams.setParam('page', $scope.currentPage + 1, true);
      };
      $scope.prevPage = function () {
        if ($scope.currentPage === 1) return;
        urlParams.setParam('page', $scope.currentPage - 1, true);
      };
      $rootScope.$on('paramsChange', function () {
        $scope.currentPage = parseInt(urlParams.getParam('page'), 10);
      });
    }
  };
});
