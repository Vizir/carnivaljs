var app = angular.module('exampleApp', ['carnival']);

app.config(function (CarnivalConfigProvider) {
  CarnivalConfigProvider.setBaseApiUrl('http://localhost:3000');
});

app.controller('testCtrl', ['$scope', 'CarnivalConfig', function ($scope, CarnivalConfig) {
  $scope.url = CarnivalConfig.getBaseApiUrl();
}]);