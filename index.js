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
        views: ['show', 'create', 'list', 'edit']
      },
      'content': {
        label: 'Content',
        type: 'text',
        views: ['show', 'create', 'list', 'edit']
      }
    },

    relations: {
      'comments': {
        type: 'hasMany'
      },
      'tags': {
        type: 'hasMany'
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
        views: ['show', 'list', 'create', 'edit']
      },
      'content': {
        label: 'Content',
        type: 'text',
        views: ['show', 'list', 'create', 'edit']
      }
    },

    relations: {
      'posts': {
        type: 'belongsTo'
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
        views: ['show', 'list', 'create', 'edit']
      }
    },

    relations: {
      'posts': {
        type: 'hasMany'
      }
    }

  });

});