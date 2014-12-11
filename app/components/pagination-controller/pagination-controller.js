angular.module('carnival.components.pagination-controller', [])
.directive('carnivalPaginationCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      currentPage: '=',
      totalPages: '=',
      load: '='
    },
    templateUrl: 'components/pagination-controller/pagination-controller.html',
    link: function (scope) {
      scope.next = function () {
        if (scope.currentPage < scope.totalPages) {
          scope.currentPage++;
          console.log('Current page from directive: ' + scope.currentPage);
          scope.load();
        }
      };
      scope.prev = function () {
        if (scope.currentPage > 1) {
          scope.currentPage--;
          console.log('Current page from directive: ' + scope.currentPage);
          scope.load();
        }
      };
      scope.jump = function (page) {
        if (page !== scope.currentPage) {
          scope.currentPage = page;
          console.log('Current page from directive: ' + scope.currentPage);
          scope.load();
        }
      };
    }
  };
});
