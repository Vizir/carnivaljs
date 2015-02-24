var app = angular.module('exampleApp', ['carnival']);
app.config(function (ConfigurationProvider, $locationProvider) {
  ConfigurationProvider.setAppName('Carnival Example Application');
  ConfigurationProvider.setBaseApiUrl('http://private-614d1-carnivaljs.apiary-mock.com');
  ConfigurationProvider.validateEntities(true);
  ConfigurationProvider.initialPage({ type: 'entity', entity: 'comments' });
});
