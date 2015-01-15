angular.module('carnival.components.fields.file', [])
.directive('carnivalFileField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '=',
      editable: '='
    },
    templateUrl: 'components/fields/file/file.html',
    controller: function ($scope, $http, Configuration) {

      $scope.checkIfIsImage = function (file) {
        return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file);
      };

      $scope.checkIfHasUploader = function () {
        return typeof $scope.field.uploader !== 'undefined';
      };

      $scope.checkIfHasGallery = function () {
        return typeof $scope.field.gallery !== 'undefined';
      };

    }
  };
});
