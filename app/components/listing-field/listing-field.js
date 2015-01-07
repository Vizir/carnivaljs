angular.module('carnival.components.listingfield', [])
.directive('carnivalListingField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field/listing-field.html'    
  };
});
