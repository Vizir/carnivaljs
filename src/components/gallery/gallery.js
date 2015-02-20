angular.module('carnival.components.gallery', [])
.directive('carnivalGallery', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      gallery: '=',
      fileUrl: '='
    },
    controller: function ($scope, $injector) {
      if (!window.CARNIVAL) window.CARNIVAL = {};
      if (!window.CARNIVAL.gallery) window.CARNIVAL.gallery = {};
      window.CARNIVAL.gallery.sendUrl = function (url) {
        $scope.fileUrl = url;
        $scope.$parent.$parent.$apply();
      };
      $scope.open = function () {
        var url;
        if (typeof $scope.gallery.url === 'function') {
          url = $scope.gallery.url($injector);
        } else {
          url = $scope.gallery.url;
        }
        window.open(url, 'WINDOW_GALLERY', 'dialog');
      };
    },
    templateUrl: 'components/gallery/gallery.html'
  };
});
