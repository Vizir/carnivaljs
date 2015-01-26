angular.module('carnival')
.service('Notification', function ($timeout, notificationFactory) {

  var notificationKiller = function () {
    notificationFactory.splice(notificationFactory.length - 1, 1);
  };

  function Notification (message, type) {
    this.message = message;
    this.type = type;
    notificationFactory.unshift(this);
    $timeout(notificationKiller, 3000);
  }

  return Notification;

});
