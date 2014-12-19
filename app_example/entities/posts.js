var app = angular.module('exampleApp');

app.config(function (ConfigurationProvider) {

  ConfigurationProvider.addEntity('posts' /* required: this will be the endpoint name */, {

    identifier: 'id', // required: the identifier field
    label: 'Posts', // optional: if not declared it will get the name of this entity
    pagination: 10, // optional: if not set all items will show on the page

    quickFilters: [
      { label: 'Food', field: 'category', value: function () {
        return '1';
      }},
      { label: 'Sport', field: 'category', value: function () {
        return '2';
      }}
    ],

    fields: {
      // ---- ID Field ----
      'id' /* required: field name */: {
        type: 'text', // required
        label: 'Id', // optional
        views: { // required: set options on each view
          index: {
            enable: false, // required: if this field will appear on the view
            searchable: false, // optional: default is true
            sortable: false // optional: default is true
          },
          create: {
            enable: false // required: if this field will appear on the view
          },
          edit: {
            enable: false // required: if this field will appear on the view
          },
          show: {
            enable: false // required: if this field will appear on the view
          }
        }
      },
      // ---- Title Field ----
      'title': {
        type: 'text',
        label: 'Title',
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
      // ---- Content Field ----
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
      // ---- Category (Relation) Field ----
      'category': { // If this field will be a relation, this will turn into the endpoint
        type: 'belongsTo',
        label: 'Category',
        endpoint: 'categories',
        identifier: 'id',
        field: 'name',
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
      // ---- Comments (Relation) Field ----
      'comments': {
        type: 'hasMany',
        from: 'post',
        label: 'Comments',
        endpoint: 'comments',
        identifier: 'id',
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
      // ---- Tags (Relation) Field ----
      'tags': {
        type: 'hasMany',
        from: 'post',
        label: 'Tags',
        endpoint: 'tags',
        identifier: 'id',
        field: 'name',
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
