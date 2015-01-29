angular.module('carnival', [
  'carnival.templates',
  'ui.router',
  'carnival.components',
  'pascalprecht.translate',
  'datePicker',
  'ngWig',
  'angular-loading-bar'
])
.config(function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider) {

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
.run(function (Configuration, Entity){
  // Model entities
  Configuration.addExtraStates();
  for (var i = 0, entities = Configuration.entities, x = entities.length; i < x; i++) {
    entities[i] = new Entity(entities[i].name, entities[i].options);
  }
});
