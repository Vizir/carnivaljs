angular.module('carnival.components.listing', [])
.directive('carnivalListing', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      datas: '=',
      actions: '=',
      extraActions: '=',
      identifier: '=',
      entityName: '='
    },
    templateUrl: 'components/listing/listing.html'
  };
});
