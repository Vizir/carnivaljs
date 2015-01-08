angular.module('carnival.components.search-controller', [])
.directive('carnivalSearchCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      relatedResources: '='
    },
    templateUrl: 'components/search-controller/search-controller.html',
    controller: function ($scope, urlParams) {
      $scope.searchParams = urlParams.getParam('search') || {};
      $scope.submit = function () {
        var searchParamsKeys = Object.keys($scope.searchParams);
        for (var i = 0, x = searchParamsKeys.length; i < x; i += 1) {
          urlParams.setParam('search.' + searchParamsKeys[i], $scope.searchParams[searchParamsKeys[i]]);
        }
        urlParams.emitLoadEvent();
      };
    }
  };
});
