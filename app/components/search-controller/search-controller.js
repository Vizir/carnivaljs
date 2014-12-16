angular.module('carnival.components.search-controller', [])
.directive('carnivalSearchCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '='
    },
    templateUrl: 'components/search-controller/search-controller.html',
    controller: function ($scope, urlParams) {
      $scope.searchParams = urlParams.getFilter('search') || {};
      $scope.submit = function () {
        urlParams.setFilter('search', $scope.searchParams, true);
      };
    }
  };
});
