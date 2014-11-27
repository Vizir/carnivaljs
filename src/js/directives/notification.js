define(function () {

  var notification = ['$timeout', 'SharedData', function ($timeout, SharedData) {
    return function () {
      $timeout(function () {
        SharedData.notifications.shift();
      }, 5000);
    };
  }];

  return notification;

});