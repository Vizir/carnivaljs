angular.module('carnival.components.listing', [])
.directive('carnivalListing', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      datas: '=',
      actions: '=',
      identifier: '=',
      entityName: '='
    },
    templateUrl: 'components/listing/carnival-listing.html'
  };
});
