angular.module('router', ['ui.router', 'controllers'])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state('main', {
      url: '/',
      templateUrl: 'js/templates/main.html',
      controller: 'mainCtrl'
    })

    .state('main.list', {
      url: 'list/:entity',
      templateUrl: 'js/templates/list.html',
      controller: 'listCtrl'
    })

    .state('main.show', {
      url: 'show/:entity/:id',
      templateUrl: 'js/templates/show.html',
      controller: 'showCtrl'
    })

    .state('main.create', {
      url: 'create/:entity',
      templateUrl: 'js/templates/create.html',
      controller: 'createCtrl'
    })

    .state('main.edit', {
      url: 'edit/:entity/:id',
      templateUrl: 'js/templates/edit.html',
      controller: 'editCtrl'
    });

}]);