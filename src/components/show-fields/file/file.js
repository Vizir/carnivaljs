angular.module('carnival.components.showFile', [])
.directive('carnivalShowFile', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/file/file.html',
    controller: function ($scope, $http, Configuration) {
      $scope.checkIfIsImage = function (file) {
        return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file);
      };
    }
  };
});
