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
    link: function (scope) {

      scope.nextPage = function () {
        if (scope.currentPage === scope.totalPages) return;
        scope.currentPage += 1;
      };

      scope.prevPage = function () {
        if (scope.currentPage ===  1) return;
        scope.currentPage -= 1;
      };

      scope.jumpTo = function (page) {
        scope.currentPage = page;
      };

    }
  };
});
