angular.module('carnival')
.service('Notification', function ($timeout, notificationFactory) {

  var notificationKiller = function () {
    notificationFactory.splice(notificationFactory.length - 1, 1);
  };

  function Notification (message, type, opts) {
    if(!opts)
      opts = {};
    this.message = message;
    this.type = type;
    var timeout = opts.timeout || 3000;
    var callback = opts.callback;
    notificationFactory.unshift(this);
    $timeout(function(){
      notificationKiller();
      if(callback)
        callback();
    }, timeout);
  }

  return Notification;

});
