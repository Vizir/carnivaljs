define(function (require) {

  var angular = require('angular');
  var config = angular.module('config', []);

  config.provider('Api', require('providers/api.js'));
  config.provider('Entity', require('providers/entity.js'));

  return config;

});