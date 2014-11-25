define('angular', [], function () {

  return angular;

});

require.config({

  paths: {
    
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'restangular': 'bower_components/restangular/dist/restangular',
    'lodash': 'bower_components/lodash/dist/lodash.min',
    'text': 'bower_components/requirejs-text/text',

    'Config': 'providers/config',
    'Router': 'router'

  },

  shim: {

    'angular-ui-router': {
      deps: ['angular']
    },

    'restangular': {
      deps: ['angular', 'lodash']
    }
    
  }

});

define(function (require) {

  var angular = require('angular');
  require('Config');
  require('Router');
  require('restangular');

  angular.module('carnival', ['config', 'router', 'restangular']);

});