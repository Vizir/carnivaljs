angular.module('carnival.components.notification', [])
.directive('carnivalNotification', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    templateUrl: 'components/notification/notification.html',
    controller: function ($scope, notificationFactory) {
      $scope.notifications = notificationFactory;
    }
  };
});
