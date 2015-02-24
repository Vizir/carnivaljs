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
    controller: function ($scope, $state, $stateParams, urlParams, $location) {
    
      var urlPrefix = "#";
      if($location.$$html5){
        urlPrefix = "";
      }

      $scope.buildUrl = function (link) {
        if (link.type === 'entity') return urlPrefix + '/list/' + link.url;
        if (link.type === 'state')  return urlPrefix + '/' + link.url;
        if (link.type === 'url')    return link.url;
        return '#';
      };

      $scope.checkSelEntity = function (index) {
        var url = $state.current.url.replace(':entity', $stateParams.entity);
        if (url.indexOf($scope.menuItems[index].link.url) > -1) {
          return true;
        } else {
          return false;
        }
      };
    }
  };
});
