angular.module('carnival.components.showDate', [])
.directive('carnivalShowDate', function ($filter) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/date/date.html',
    link: function (scope) {
      scope.toDate = function (dateStr) {
        var date = new Date(dateStr);
        return $filter('date')(date, 'dd/MM/yyyy HH:mm:ss');
      };
    }
  };
});
