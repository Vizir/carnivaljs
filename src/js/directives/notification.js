angular.module('notification', [])
.directive('notification', ['$timeout', 'SharedData', function ($timeout, SharedData) {

  return function () {
    $timeout(function () {
      SharedData.notifications.shift();
    }, 5000);
  };

}]);