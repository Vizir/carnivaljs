angular.module('carnival.components.navbar', [])
.directive('carnivalNavbar', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      appName: '=',
      menuItems: '='
    },
    templateUrl: 'components/navbar/navbar.html',
    controller: function ($scope, $stateParams, urlParams) {
      $scope.checkSelEntity = function (index) {
        if ($scope.menuItems[index].name === $stateParams.entity) return true;
        return false;
      };
      $scope.resetPage = function () {
        urlParams.clearFilters();
        urlParams.setFilter('page', 1);
      };
    }
  };
});
