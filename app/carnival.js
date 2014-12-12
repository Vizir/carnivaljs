angular.module('carnival', [
  'carnival.templates',
  'ui.router',
  'carnival.components',
  'gettext',
  'angular-loading-bar'
])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'states/main/main.html',
      controller: 'MainController'
    })
    .state('main.list', {
      url: 'list/:entity?page&order&orderDir',
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

    $httpProvider.useApplyAsync(true);

})
.run(function (gettextCatalog, Configuration, Entity){
  // Set language Options
  gettextCatalog.currentLanguage = Configuration.getLanguage();
  gettextCatalog.debug = true;
  // Model entities
  for (var i = 0, entities = Configuration.entities, x = entities.length; i < x; i++) {
    entities[i] = new Entity(entities[i].name, entities[i].options);
  }
});

// Sample
// http://[base_api_url]/:entity?sortField=title&sortDir=desc
// http://[base_api_url]/:entity?filter[status]=2&filter[title]=example
// http://[base_api_url]/:entity?offset=1&limit=2
