var app = angular.module('exampleApp', ['carnival']);

app.config(function (ApiProvider, EntityProvider) {

  ApiProvider.setAppName('Carnival Example');
  ApiProvider.setBaseApiUrl('http://localhost:3000');
  
  EntityProvider.addEntity('courses', {

    label: 'Courses',

    fields: {
      'id': {
        label: 'Id',
        type: 'number',
        views: ['delete']
      },

      'name': {
        label: 'Name',
        type: 'text',
        views: ['create' ,'list', 'edit']
      }
    }

  });

  EntityProvider.addEntity('pages', {

    label: 'Pages',

    fields: {
      'id': {
        label: 'Id',
        type: 'number',
        views: ['list', 'edit', 'delete']
      },

      'title': {
        label: 'Title',
        type: 'text',
        views: ['list', 'create', 'edit', 'delete']
      },

      'content': {
        label: 'Content',
        type: 'text',
        views: ['list', 'create', 'edit', 'delete']
      }
    }

  });

  EntityProvider.addEntity('files', {

    label: 'Files',

    fields: {

      'id': {
        label: 'Id',
        type: 'number',
        views: ['list']
      },

      'fileName': {
        label: 'File Name',
        type: 'text',
        views: ['list', 'create', 'delete']
      },

      'fileSize': {
        label: 'File Size',
        type: 'text',
        views: ['list']
      },

      'original': {
        label: 'Link',
        type: 'text',
        views: []
      }
    }

  });

  EntityProvider.addEntity('tags', {

    label: 'Tags',

    fields: {
      'id': {
        label: 'Id',
        type: 'number',
        views: ['list']
      },

      'name': {
        label: 'Name',
        type: 'text',
        views: ['list', 'edit', 'create', 'delete']
      }
    }

  });

});