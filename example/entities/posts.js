var app = angular.module('exampleApp');

app.config(function (ConfigurationProvider) {

  ConfigurationProvider.addEntity('posts' /* required: this will be the endpoint name */, {

    identifier: 'id', // required: the identifier field
    label: 'Posts', // optional: if not declared it will get the name of this entity
    pagination: 10, // optional: if not set all items will show on the page

    quickFilters: [
      { label: 'Food', field: 'categoryId', value: function () {
        return '1';
      }},
      { label: 'Sport', field: 'categoryId', value: function () {
        return '2';
      }}
    ],

    extraActions:{
      'createComment':{
        label: 'New Comment',
        url: '/createComment/:id'
      }
    },

    fields: {
      // ---- ID Field ----
      'id' /* required: field name */: {
        type: 'string', // required
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
        type: 'string',
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
        type: 'wysiwyg',
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
      'published': {
        type: 'boolean',
        label: 'Published',
        views: {
          index: {
            enable: true,
            searchable: true
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
        entityName: 'categories',
        endpoint: 'categories',
        identifier: 'id',
        field: 'name',
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
      },
      // ---- Comments (Relation) Field ----
      'comments': {
        type: 'hasMany',
        entityName: 'comments',
        label: 'Comments',
        endpoint: 'comments',
        identifier: 'id',
        field: 'email',
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true,
            enableDelete: true,
            nested: {
              type: 'side'
            }
          },
          edit: {
            enable: true,
            enableDelete: true,
            nested: {
              type: 'side'
            }
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
            enable: true
          },
          edit: {
            enable: true,
            nested: true
          },
          show: {
            enable: true
          }
        }
      },
      'thumbnail': {
        type: 'file',
        label: 'Thumbnail',
        uploader: {
          endpoint: 'files', // The endpoint where the upload will be requested.
          // endpointUrl: 'http://localhost:3000/files', // If use endpointUrl it will overwrite the base url setted for this application.
          getUrl: function (data) { // This function will receive the response data, you will need to return the uploaded file's Url.
            return data.fileUrl;
          }
        },
        // gallery: {
        //   url: 'http://localhost:3010' // You can use your own file manager as gallery to pick a file, you just need to access window.opener.CARNIVAL.gallery.sendUrl(<string: your_url>) to send the Url for the file.
        // },
        views: {
          index: {
            enable: true,
            sortable: false,
            searchable: false
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
      'price': {
        type: 'currency',
        currencyOptions: {
          symbol: '$',
          decimalDelimiter: '.',
          thousandsDelimiter: ',',
          decimals: 2
        },
        label: 'Price',
        views: {
          index: {
            enable: true,
            sortable: false,
            searchable: true
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
      'state': {
        type: 'enum',
        label: 'State',
        values: [ // For enums field you will need to define the values...
          { value: 1, label: 'Published' }, // Every possible option will have a value, that is the value that your backend will send/receive
          { value: 2, label: 'Pending' },// And will need to have the label, that is what it will show on your application
          { value: 3, label: 'Deleted' }
        ],
        views: {
          index: {
            enable: true,
            sortable: false,
            searchable: true
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
