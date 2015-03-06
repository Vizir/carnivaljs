angular.module('carnival.components.listingfieldboolean', [])
.directive('carnivalListingFieldBoolean', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-boolean/listing-field-boolean.html'
  };
});
