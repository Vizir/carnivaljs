define('angular', [], function () {

  return angular;

});

require.config({
  paths: {
    'CarnivalConfig': 'config/CarnivalConfig'
  }
});

define(function (require) {

  var angular = require('angular');
  require('CarnivalConfig');

  angular.module('carnival', ['config']);

});