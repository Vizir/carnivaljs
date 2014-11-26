define('angular', [], function () {

  return angular;

});

require.config({

  paths: {
    
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'text': 'bower_components/requirejs-text/text',

    'Config': 'providers/config',
    'Router': 'router'

  },

  shim: {

    'angular-ui-router': {
      deps: ['angular']
    }
    
  }

});

define(function (require) {

  var angular = require('angular');
  require('Config');
  require('Router');
  require('factories/shared-data');
  require('directives/directives');

  angular.module('carnival', ['config', 'router', 'shared-data', 'directives']);

});