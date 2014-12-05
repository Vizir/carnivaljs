angular.module('carnival', [
  'templates-dist',
  'ui.router',
  'carnival.models',
  'carnival.services',
  'carnival.directives',
  'carnival.controllers',
  'gettext'
])
.config(function ($stateProvider, $urlRouterProvider) {

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

})
.run(function (gettextCatalog, Configuration){
  gettextCatalog.currentLanguage = Configuration.getLanguage();
  gettextCatalog.debug = true;
});

angular.module('carnival.controllers', []);
angular.module('carnival.services', []);
angular.module('carnival.models', []);
angular.module('carnival.directives', []);

// Sample
// http://[base_api_url]/:entity?sortField=title&sortDir=desc
// http://[base_api_url]/:entity?filter[status]=2&filter[title]=example
// http://[base_api_url]/:entity?offset=1&limit=2
// http://[base_api_url]/:entity?sortField=title&sortDir=desc
