angular.module('carnival.components.quickfilter-controller', [])
.directive('carnivalQuickFilter', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      filters: '='
    },
    templateUrl: 'components/quickfilter-controller/quickfilter-controller.html',
    controller: function ($scope, urlParams) {

      $scope.isSelected = function (field, value) {
        return value === urlParams.getParam('search.' + field);
      };

      $scope.setFilter = function (field, value) {
        urlParams.setParam('search.' + field, value, true);
      };

    }
  };
});
