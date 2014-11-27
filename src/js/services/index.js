define(function (require) {

  var angular = require('angular');
  var services = angular.module('services', []);
  
  services.factory('SharedData', require('services/shared-data.js'));
  services.factory('http', require('services/http.js'));

  return services;

});