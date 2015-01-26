angular.module('carnival')
.controller('MainController', function ($scope, Configuration) {

  var app_name = $scope.app_name = Configuration.getAppName(),
      menu_items = $scope.menu_items = Configuration.getNavbarItems();

});
