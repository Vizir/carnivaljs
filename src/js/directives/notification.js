angular.module('directives.notification', ['services.shared-data'])

.directive('notification', ['$timeout', 'SharedData', function ($timeout, SharedData) {
  return function () {
    $timeout(function () {
      SharedData.notifications.shift();
    }, 3000);
  };

}]);