angular.module('carnival.components.navbar', [])
.directive('carnivalNavbar', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      appName: '=',
      menuItems: '='
    },
    templateUrl: 'components/navbar/navbar.html'
  };
});
