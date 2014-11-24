define(function (require) {

  var angular = require('angular');

  var config = angular.module('config', []);

  config.provider('CarnivalConfig', require('config/ApiConfig.js'));

  return config;

});