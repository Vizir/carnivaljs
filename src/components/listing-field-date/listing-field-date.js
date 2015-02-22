angular.module('carnival.components.listingFieldDate', [])
.directive('carnivalListingFieldDate', function ($filter) {
  return {
    restrict: 'E',
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-date/listing-field-date.html',
    link: function (scope) {
      scope.toDate = function (dateStr) {
        var date = new Date(dateStr);
        return $filter('date')(date, 'dd/MM/yyyy HH:mm:ss');
      };
    }
  };
});
