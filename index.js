var app = angular.module('exampleApp', ['carnival']);

app.config(function (ConfigurationProvider) {

  ConfigurationProvider.setAppName('Carnival Example');

  ConfigurationProvider.setBaseApiUrl('http://private-614d1-carnivaljs.apiary-mock.com');

  ConfigurationProvider.addEntity('posts', {

    label: 'Posts',
    identifier: 'id',
    filters: ['published', 'draft', 'archived'],

    fields: {

      'id': {
        label: 'Id',
        type: 'text',
        searchable: false,
        views: {
          index: {
            enable: false
          },
          create: {
            enable: false
          },
          show: {
            enable: false
          },
          edit: {
            enable: false
          }
        }
      },

      'title': {
        label: 'Title',
        type: 'text',
        searchable: true,
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          show: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      },

      'category':{
        label: 'Category',
        type: 'belongsTo',
        searchable: true,
        resourceName: 'categories',
        resourceLabel: 'name',
        resourceIdentifier: 'id',
        views: {
          index: {
            enable: true,
          },
          create: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      },

      'content': {
        label: 'Content',
        type: 'text',
        searchable: false,
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          show: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      }

      // 'comments': {
      //   endpoint: 'comments',
      //   label: 'Comments',
      //   type: 'hasMany',
      //   views: {
      //     index: {
      //       enable: false
      //     },
      //     create: {
      //       enable: false
      //     },
      //     show: {
      //       enable: true,
      //       nested: {
      //         mode:['new', 'associate', 'deassociate', 'edit']
      //       }
      //     },
      //     edit: {
      //       enable: true,
      //       nested: {
      //         mode:['new', 'associate', 'deassociate', 'edit']
      //       }
      //     }
      //   }

      // },

      // 'tags': {
      //   endpoint: 'tags',
      //   label: 'Tags',
      //   type: 'hasMany',
      //   views: {
      //     index: {
      //       enable: false
      //     },
      //     create: {
      //       enable: false
      //     },
      //     show: {
      //       enable: true,
      //       nested: {
      //         mode:['new', 'associate', 'deassociate', 'edit']
      //       }
      //     },
      //     edit: {
      //       enable: true,
      //       nested: {
      //         mode:['new', 'associate', 'deassociate', 'edit']
      //       }
      //     }
      //   }
      // }
    }
  });

  ConfigurationProvider.addEntity('comments', {

    label: 'Comments',
    identifier: 'id',

    fields: {

      'id': {
        identifier: true,
        label: 'Id',
        type: 'text',
        searchable: false,
        views: {
          index: {
            enable: false
          },
          create: {
            enable: false
          },
          show: {
            enable: false
          },
          edit: {
            enable: false
          }
        }
      },

      'email': {
        label: 'Email',
        type: 'text',
        searchable: true,
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          show: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      },

      'post': {
        label: 'Post',
        type: 'belongsTo',
        searchable: true,
        resourceName: 'posts',
        resourceIdentifier: 'id',
        resourceLabel: 'title',
        views: {
          index: {
            enable: true,
          },
          create: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      },

      'content': {
        label: 'Content',
        type: 'text',
        searchable: false,
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          show: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      },

      // 'posts': {
      //   endpoint: 'post',
      //   label: 'Post',
      //   type: 'belongsTo',
      //   foreignKey: 'postId',
      //   views: {
      //     index: {
      //       enable: false
      //     },
      //     create: {
      //       enable: false
      //     },
      //     show: {
      //       enable: true,
      //       nested: {
      //         mode:['new', 'associate', 'deassociate', 'edit']
      //       }
      //     },
      //     edit: {
      //       enable: true,
      //       nested: {
      //         mode:['new', 'associate', 'deassociate', 'edit']
      //       }
      //     }
      //   }
      // }
    }
  });

  ConfigurationProvider.addEntity('categories', {

    label: 'Categories',
    identifier: 'id',

    fields: {

      'id': {
        identifier: true,
        label: 'Id',
        searchable: false,
        type: 'text',
        views: {
          index: {
            enable: false
          },
          create: {
            enable: false
          },
          show: {
            enable: false
          },
          edit: {
            enable: false
          }
        }
      },

      'name': {
        label: 'Name',
        type: 'text',
        searchable: true,
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          show: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      }
    }
  });
  ConfigurationProvider.addEntity('tags', {

    label: 'Tags',
    identifier: 'id',
    filters: ['published', 'draft', 'archived'],

    fields: {

      'id': {
        identifier: true,
        label: 'Id',
        type: 'text',
        searchable: false,
        views: {
          index: {
            enable: false
          },
          create: {
            enable: false
          },
          show: {
            enable: false
          },
          edit: {
            enable: false
          }
        }
      },

      'name': {
        label: 'Name',
        type: 'text',
        searchable: true,
        views: {
          index: {
            enable: true
          },
          create: {
            enable: true
          },
          show: {
            enable: true
          },
          edit: {
            enable: true
          }
        }
      },

      // 'posts': {
      //   endpoint: 'posts',
      //   label: 'Post',
      //   type: 'hasMany',
      //   views: {
      //     index: {
      //       enable: false
      //     },
      //     create: {
      //       enable: false
      //     },
      //     show: {
      //       enable: true,
      //       nested: {
      //         mode:['new', 'associate', 'deassociate', 'edit']
      //       }
      //     },
      //     edit: {
      //       enable: true,
      //       nested: {
      //         mode:['new', 'associate', 'deassociate', 'edit']
      //       }
      //     }
      //   }
      // }
    }

  });

});
