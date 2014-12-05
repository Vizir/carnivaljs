angular.module('carnival', [
  'templates-dist',
  'ui.router',
  'carnival.components',
  'gettext'
])
.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'states/main/main.html',
      controller: 'MainController'
    })
    .state('main.list', {
      url: 'list/:entity',
      templateUrl: 'states/main.list/list.html',
      controller: 'ListController'
    })
    .state('main.show', {
      url: 'show/:entity/:id',
      templateUrl: 'states/main.show/show.html',
      controller: 'ShowController'
    })
    .state('main.create', {
      url: 'create/:entity',
      templateUrl: 'states/main.create/create.html',
      controller: 'CreateController'
    })
    .state('main.edit', {
      url: 'edit/:entity/:id',
      templateUrl: 'states/main.edit/edit.html',
      controller: 'EditController'
    });

})
.run(function (gettextCatalog, Configuration){
  gettextCatalog.currentLanguage = Configuration.getLanguage();
  gettextCatalog.debug = true;
});

// Sample
// http://[base_api_url]/:entity?sortField=title&sortDir=desc
// http://[base_api_url]/:entity?filter[status]=2&filter[title]=example
// http://[base_api_url]/:entity?offset=1&limit=2
// http://[base_api_url]/:entity?sortField=title&sortDir=desc
