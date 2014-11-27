define('angular', [], function () {

  return angular;

});

require.config({

  paths: {
    
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'text': 'bower_components/requirejs-text/text',

    'Router': 'router',
    'Config': 'providers/index',
    'Services': 'services/index',
    'Directives': 'directives/index'

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
  require('Services');
  require('Directives');

  angular.module('carnival', ['config', 'router', 'services', 'directives']);

});