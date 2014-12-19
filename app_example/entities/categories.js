var app = angular.module('exampleApp');

app.config(function (ConfigurationProvider) {

  ConfigurationProvider.addEntity('categories', {

    identifier: 'id',
    label: 'Categories',
    pagination: 10,

    fields: {
      'id': {
        type: 'text',
        label: 'Id',
        views: {
          index: {
            enable: false
          },
          create: {
            enable: false
          },
          edit: {
            enable: false
          },
          show: {
            enable: false
          }
        }
      },
      'name': {
        type: 'text',
        label: 'Name',
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          edit: {
            enable: true
          },
          show: {
            enable: true
          }
        }
      },
      'posts': {
        type: 'hasMany',
        label: 'Posts',
        endpoint: 'posts',
        identifier: 'id',
        field: 'title',
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          edit: {
            enable: true
          },
          show: {
            enable: true
          }
        }
      }
    }
  });
});
