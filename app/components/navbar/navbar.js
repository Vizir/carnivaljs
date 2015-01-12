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

      $scope.buildUrl = function (link) {
        if (link.type === 'entity') return '#/list/' + link.url;
        if (link.type === 'url')    return link.url;
        return '#';
      };

      $scope.checkSelEntity = function (index) {
        if ($scope.menuItems[index].link.type === 'entity' &&
            $scope.menuItems[index].link.url === $stateParams.entity) {
          return true;
        } else {
          return false;
        }
      };
    }
  };
});
