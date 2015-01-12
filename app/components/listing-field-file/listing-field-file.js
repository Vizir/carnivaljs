angular.module('carnival.components.listingFieldFile', [])
.directive('carnivalListingFieldFile', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-file/listing-field-file.html',
    controller: function ($scope) {
      $scope.checkIfIsImage = function (file) {
        return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file);
      };
    }
  };
});
