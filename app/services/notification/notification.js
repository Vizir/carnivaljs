angular.module('carnival')
.service('Notification', function ($timeout, notificationFactory) {

  var notificationKiller = function () {
    notificationFactory.splice(0, 1);
    console.log(notificationFactory);
  };

  function Notification (message, type) {
    this.message = message;
    this.type = type;
    notificationFactory.push(this);
    $timeout(notificationKiller, 3000);
  }

  return Notification;

});
