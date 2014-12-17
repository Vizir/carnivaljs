angular.module('carnival.components.quickfilter-controller', [])
.directive('carnivalQuickFilter', function (urlParams) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      filters: '='
    },
    templateUrl: 'components/quickfilter-controller/quickfilter-controller.html',
    link: function (scope) {

      var searchs = urlParams.getFilter('search') || {};

      scope.isSelected = function (field, value) {
        if (!searchs[field]) return false;
        return value === searchs[field];
      };

      scope.setFilter = function (field, value) {
        searchs[field] = value;
        urlParams.setFilter('search', searchs, true);
      };
    }
  };
});
