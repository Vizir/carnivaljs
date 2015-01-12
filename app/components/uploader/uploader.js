angular.module('carnival.uploader', [])
.directive('carnivalUploader', function () {
  return {
    restrict: 'E',
    scope: {
      uploader: '=',
      fileUrl: '='
    },
    templateUrl: 'components/uploader/uploader.html',
    controller: function ($scope, $http, Notification, Configuration) {

      var getRequestUrl = function () {
        if ($scope.uploader.endpoint && $scope.uploader.endpointUrl) {
          throw 'Set only one type of endpoint for the uploader';
        }
        if ($scope.uploader.endpoint) {
          return Configuration.getBaseApiUrl() + '/' + $scope.uploader.endpoint;
        }
        return $scope.uploader.endpointUrl;
      };

      $scope.upload = function (file) {
        var formData = new FormData();
        formData.append('file', $scope.files[0]);

        $http.post(getRequestUrl(), formData, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        })
        .success(function (data) {
          new Notification('File uploaded with success', 'success');
          $scope.fileUrl = $scope.uploader.getUrl(data);
        })
        .error(function (error) {
          new Notification(error, 'warning');
        });

      };
    }
  };
})

.directive('fileInput', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      element.bind('change', function () {
        $parse(attributes.fileInput)
        .assign(scope, element[0].files);
        scope.$apply();
      });
    }
  };
});
