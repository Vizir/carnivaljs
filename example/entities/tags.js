var app = angular.module('exampleApp');

app.config(function (ConfigurationProvider) {

  ConfigurationProvider.addEntity('tags', {

    identifier: 'id',
    label: 'Tags',
    pagination: 10,

    fields: {
      'id': {
        type: 'string',
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
        type: 'string',
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
      'comments': {
        type: 'hasMany',
        label: 'comments',
        endpoint: 'comments',
        foreignKey: 'commentId',
        identifier: 'id',
        entityName: 'comments',
        field: 'email',
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
        foreignKey: 'postId',
        identifier: 'id',
        entityName: 'posts',
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
