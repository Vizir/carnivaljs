angular.module('carnival.components.search-controller', [])
.directive('carnivalSearchCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      relatedResources: '='
    },
    templateUrl: 'components/search-controller/search-controller.html',
    controller: function ($scope, $stateParams, Configuration, urlParams) {

      $scope.searchParams = urlParams.getFilter('search') || {};

      var onClick = function () {
        urlParams.setFilter('search', $scope.searchParams, true);
        console.log(urlParams.getFilter('search'));
      };

      $scope.action = {
        label: 'Submit',
        click: onClick
      };
    }
  };
});
