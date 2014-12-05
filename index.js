var app = angular.module('exampleApp', ['carnival']);

app.config(function (ConfigurationProvider, ConfigurationProvider, HttpAdapterProvider) {

  ConfigurationProvider.setAppName('Carnival Example');

  ConfigurationProvider.setBaseApiUrl('http://private-614d1-carnivaljs.apiary-mock.com');

  ConfigurationProvider.addEntity('posts', {

    // defaultField:{
    //   views: {
    //     index: {
    //         sort: false,
    //         search: {operator: "equal"}
    //     },
    //     edit: {


    //     }
    //   }
    // },

    label: 'Posts',
    identifier: 'id',
    filters: ['published', 'draft', 'archived'],

    fields: {

      'id': {
        label: 'Id',
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

      'title': {
        label: 'Title',
        type: 'text',
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

      'content': {
        label: 'Content',
        type: 'text',
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
      // },

      // 'status': {
      //   type: 'enum',
      //   enumValues: {
      //     'draft': 0,
      //     'published': 1,
      //     'archived': 2
      //   },
      //   views: {
      //     index: {
      //       enable: true
      //     },
      //     create: {
      //       enable: true
      //     },
      //     show: {
      //       enable: true
      //     },
      //     edit: {
      //       enable: true
      //     }
      //   }
      // }
    }
  });

  ConfigurationProvider.addEntity('comments', {

    label: 'Comments',
    identifier: 'id',
    filters: ['published', 'draft', 'archived'],

    fields: {

      'id': {
        identifier: true,
        label: 'Id',
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

      'email': {
        label: 'Email',
        type: 'text',
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

      'content': {
        label: 'Content',
        type: 'text',
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

      'posts': {
        endpoint: 'post',
        label: 'Post',
        type: 'belongsTo',
        foreignKey: 'postId',
        views: {
          index: {
            enable: false
          },
          create: {
            enable: false
          },
          show: {
            enable: true,
            nested: {
              mode:['new', 'associate', 'deassociate', 'edit']
            }
          },
          edit: {
            enable: true,
            nested: {
              mode:['new', 'associate', 'deassociate', 'edit']
            }
          }
        }
      },

      'status': {
        type: 'enum',
        enumValues: {
          'draft': 0,
          'published': 1,
          'archived': 2
        },
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

      'posts': {
        endpoint: 'posts',
        label: 'Post',
        type: 'hasMany',
        views: {
          index: {
            enable: false
          },
          create: {
            enable: false
          },
          show: {
            enable: true,
            nested: {
              mode:['new', 'associate', 'deassociate', 'edit']
            }
          },
          edit: {
            enable: true,
            nested: {
              mode:['new', 'associate', 'deassociate', 'edit']
            }
          }
        }
      },

      'status': {
        type: 'enum',
        enumValues: {
          'draft': 0,
          'published': 1,
          'archived': 2
        },
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

  HttpAdapterProvider.getList(function (apiUrl, entity) {
    return {
      query: apiUrl + '/' + entity,
      options: {}
    };
  });

});
