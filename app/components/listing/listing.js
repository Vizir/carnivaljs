angular.module('carnival.directives')
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
    templateUrl: 'directives/listing/listing.html'
  };
});