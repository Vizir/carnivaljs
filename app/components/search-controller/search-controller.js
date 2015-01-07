angular.module('carnival.components.search-controller', [])
.directive('carnivalSearchCtrl', function (urlParams) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      relatedResources: '='
    },
    templateUrl: 'components/search-controller/search-controller.html',
    link: function (scope) {
      scope.searchParams = urlParams.getFilter('search') || {};
      scope.submit = function () {
          urlParams.setFilter('search', scope.searchParams, true);
      };
    }
  };
});
