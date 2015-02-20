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
        var params = 'dialog';
        if ($scope.gallery.width) params += ',WIDTH=' + $scope.gallery.width;
        if ($scope.gallery.height) params += ',HEIGHT=' + $scope.gallery.height;
        window.open(url, 'WINDOW_GALLERY', params);
      };
    },
    templateUrl: 'components/gallery/gallery.html'
  };
});
