var app = angular.module('exampleApp');

app.config(function (ConfigurationProvider) {

  ConfigurationProvider.addEntity('comments', {

    identifier: 'id',
    label: 'Comments',
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
      'email': {
        type: 'string',
        label: 'Email',
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
      'content': {
        type: 'text',
        label: 'Content',
        views: {
          index: {
            enable: true,
            searchable: false,
            sortable: false
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
      'post': {
        type: 'belongsTo',
        required: true,
        entityName: 'posts',
        label: 'Post',
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
