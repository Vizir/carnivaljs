angular.module('carnival.components.fields.file', [])
.directive('carnivalFileField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      label: '=',
      editable: '='
    },
    templateUrl: 'components/fields/file/file.html',
    controller: function ($scope) {
      $scope.checkIfIsImage = function (file) {
        return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file);
      };
      $scope.openGallery = function () {

        window.CARNIVAL = {
          setFile: function (value) {
            $scope.data = value;
          }
        };

        var carnivalGalleryInstance = window.open('#/gallery', '', 'location=0, menubar=0, status=0, toolbar=0');

      };
    }
  };
});
