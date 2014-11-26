define(function (require) {

  var angular = require('angular');

  angular.module('directives', [])
  
  .directive('notification', ['$timeout', 'SharedData', function ($timeout, SharedData) {
    return function () {
      $timeout(function () {
        SharedData.notifications.shift();
      }, 5000);
    };
  }]);

});