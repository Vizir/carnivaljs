var app = angular.module('exampleApp', ['carnival']);

app.config(function (ApiProvider, EntityProvider, HttpAdapterProvider) {
 
  ApiProvider.setAppName('Carnival Example');

  ApiProvider.setBaseApiUrl('http://localhost:3000/api');
  
  EntityProvider.addEntity('posts', {

    label: 'Posts',
    identifier: 'id',
    actions: ['show', 'create', 'edit', 'delete'],

    fields: {
      'id': {
        label: 'Id',
        type: 'text',
        views: []
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
      },
      'comments': {
        endpoint: 'comments',
        label: 'Comments',
        type: 'hasMany',
        foreignKey: 'id',
        views: ['show', 'edit']
      },
      'tags': {
        endpoint: 'tags',
        label: 'Tags',
        type: 'hasMany',
        foreignKey: 'id',
        views: ['show', 'edit']
      }
    }

  });

  EntityProvider.addEntity('comments', {

    label: 'Comments',
    identifier: 'id',

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
      },
      'posts': {
        endpoint: 'post',
        label: 'Post',
        type: 'belongsTo',
        foreignKey: 'postId',
        views: ['show', 'edit']
      }
    }

  });

  EntityProvider.addEntity('tags', {

    label: 'Tags',
    identifier: 'id',

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
      },
      'posts': {
        endpoint: 'posts',
        label: 'Post',
        type: 'hasMany',
        foreignKey: 'id',
        views: ['show', 'edit']
      }
    }

  });

  HttpAdapterProvider.getList(function (apiUrl, entity) {
    return {
      query: apiUrl + '/' + entity,
      options: {}
    };
  });

});