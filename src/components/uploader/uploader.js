angular.module('carnival.components.uploader', [])
.directive('carnivalUploader', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      uploader: '=',
      fileUrl: '='
    },
    templateUrl: 'components/uploader/uploader.html',
    controller: function ($scope, $http, Uploader, Notification, Configuration, $filter) {

      var getRequestUrl = function () {
        if ($scope.uploader.endpoint && $scope.uploader.endpointUrl) {
          throw 'Set only one type of endpoint for the uploader';
        }
        if ($scope.uploader.endpoint) {
          return Configuration.getBaseApiUrl() + '/' + $scope.uploader.endpoint;
        }
        return $scope.uploader.endpointUrl;
      };

      $scope.upload = function () {

        Uploader.upload(getRequestUrl(), $scope.files[0])
        .success(function (data) {
          var message = $filter('translate')('UPLOADED_SUCCESS_MESSAGE');
          new Notification(message, 'warning');
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
