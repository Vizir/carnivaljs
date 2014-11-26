define(function (require) {
  
  var angular = require('angular');

  angular.module('shared-data', [])

  .factory('SharedData', function () {
    return {
      notifications: [],
      loading: 0
    };
  });
  
});