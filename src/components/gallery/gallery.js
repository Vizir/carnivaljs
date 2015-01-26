angular.module('carnival.components.gallery', [])
.directive('carnivalGallery', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      gallery: '=',
      fileUrl: '='
    },
    controller: function ($scope) {
      if (!window.CARNIVAL) window.CARNIVAL = {};
      if (!window.CARNIVAL.gallery) window.CARNIVAL.gallery = {};
      window.CARNIVAL.gallery.sendUrl = function (url) {
        $scope.fileUrl = url;
      };
      $scope.open = function () {
        window.open($scope.gallery.url, 'WINDOW_GALLERY', 'dialog');
      };
    },
    templateUrl: 'components/gallery/gallery.html'
  };
});
