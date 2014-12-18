SpecHelper = {
  
};

SpecHelper.Configuration = {
    getAppName: function() {
      return "Test";
    },
    getEntities: function () {
      return []; 
    },
    getEntity: function () {
      return {
        name: 'cats',
        label: 'Cats',
        identifier: 'whiskers',
        actions: ['edit', 'create', 'show', 'delete'],
        fields: [
          {
            name:  'whiskers',
            label: 'Whiskers',
            type:  'text',
            views: {
              index: {
                enable: true
              },
              create: {
              },
              show: {
                enable: true
              },
              edit: {
                enable: true
              }
            }
          },
          {
            name: 'owners',
            label: 'Owner',
            type: 'belongsTo',
            resourceLabel: 'name',
            resourceName: 'owners',
            views: {
              edit: {
                enable: true
              },
              create: {
                enable: true
              }
            }
          },
          {
            name:  'fur',
            label: 'Fur',
            type:  'text',
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
        ],
        checkFieldView: function () {
          return true;
        },
        getOne: function(){
          return {
            success: function(func){
              func({
              
              });
            }
          }; 
        },
        getList: function () {
          return {
            success: function () {
              return true;
            }
          };
        }
      };
    }
  };
