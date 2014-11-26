var app = angular.module('exampleApp', ['carnival']);

app.config(function (ApiProvider, EntityProvider) {

  ApiProvider.setAppName('Carnival Example');
  ApiProvider.setBaseApiUrl('http://localhost:3000/api');
  
  EntityProvider.addEntity('posts', {

    label: 'Posts',

    fields: {
      'id': {
        identifier: true,
        label: 'Id',
        type: 'text',
        views: ['delete']
      },
      'title': {
        label: 'Title',
        type: 'text',
        views: ['create', 'list', 'edit']
      },
      'content': {
        label: 'Content',
        type: 'text',
        views: ['create', 'list', 'edit']
      }
    }

  });

  EntityProvider.addEntity('comments', {

    label: 'Comments',

    fields: {
      'id': {
        identifier: true,
        label: 'Id',
        type: 'text',
        views: ['delete']
      },
      'email': {
        label: 'Email',
        type: 'text',
        views: ['list', 'create', 'edit']
      },
      'content': {
        label: 'Content',
        type: 'text',
        views: ['list', 'create', 'edit']
      }
    }

  });

  EntityProvider.addEntity('tags', {

    label: 'Tags',

    fields: {
      'id': {
        identifier: true,
        label: 'Id',
        type: 'text',
        views: ['delete']
      },
      'name': {
        label: 'Name',
        type: 'text',
        views: ['list', 'create', 'edit']
      }
    }

  });

});