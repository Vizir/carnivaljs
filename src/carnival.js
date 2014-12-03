angular.module('carnival', [
  'templates-dist',
  'ui.router',
  'carnival.models',
  'carnival.services',
  'carnival.directives',
  'carnival.controllers'
])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'views/main/main.html',
      controller: 'MainController'
    })
    .state('main.list', {
      url: 'list/:entity',
      templateUrl: 'views/list/list.html',
      controller: 'ListController'
    })
    .state('main.show', {
      url: 'show/:entity/:id',
      templateUrl: 'views/show/show.html',
      controller: 'ShowController'
    })
    .state('main.create', {
      url: 'create/:entity',
      templateUrl: 'views/create/create.html',
      controller: 'CreateController'
    })
    .state('main.edit', {
      url: 'edit/:entity/:id',
      templateUrl: 'views/edit/edit.html',
      controller: 'EditController'
    });

}]);

angular.module('carnival.controllers', []);
angular.module('carnival.services', []);
angular.module('carnival.models', []);
angular.module('carnival.directives', []);