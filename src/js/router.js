define(function (require) {

  var angular = require('angular');
  require('angular-ui-router');

  var router = angular.module('router', ['ui.router']);

  router.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      .state('main', {
        url: '/',
        template: require('text!templates/main.html'),
        controller: require('controllers/main.js')
      })

      .state('main.list', {
        url: 'list/:entity',
        template: require('text!templates/list.html'),
        controller: require('controllers/list.js')
      })

      .state('main.create', {
        url: 'create/:entity',
        template: require('text!templates/create.html'),
        controller: require('controllers/create.js')
      })

      .state('main.edit', {
        url: 'edit/:entity/:id',
        template: require('text!templates/edit.html'),
        controller: require('controllers/edit.js')
      });

      // .state('main.delete', {
      //   url: 'edit/:entity/:id',
      //   template: require('text!templates/delete.html'),
      //   controller: require('controllers/delete.js')
      // });

  }]);

  return router;

});