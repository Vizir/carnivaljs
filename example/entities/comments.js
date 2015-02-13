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
      'date': {
        type: 'date',
        label: 'Date',
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
            enable: false
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
      // ---- Tags (Relation) Field ----
      'tags': {
        type: 'hasMany',
        entityName: 'tags',//manytomany
        label: 'Tags',
        endpoint: 'tags',
        identifier: 'id',
        field: 'name',
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true,
            nested: {type: 'column'}
          },
          edit: {
            enable: true,
            nested: {type: 'column'}
          },
          show: {
            enable: true
          }
        }
      },
      'post': {
        type: 'belongsTo',
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
            enable: true,
            nested: true
          },
          edit: {
            enable: true,
            nested: true
          },
          show: {
            enable: true
          }
        }
      }
    }
  });
});
