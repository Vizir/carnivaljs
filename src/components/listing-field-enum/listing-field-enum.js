angular.module('carnival.components.listingFieldEnum', [])
.directive('carnivalListingFieldEnum', function () {
  return {
    restrict: 'E',
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-enum/listing-field-enum.html',
    link: function (scope, elem, attrs) {
      scope.getValue = function (item) {
        for (var i = 0, x = scope.field.values.length; i < x; i += 1) {
          if (scope.field.values[i].value === item) {
            return scope.field.values[i].label;
          }
        }
      };
    }
  };
});
