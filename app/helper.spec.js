SpecHelper = {
  
};

SpecHelper.catConfiguration = {
      name: 'cats',
      label: 'Cats',
      identifier: 'id',
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
          name: 'owner',
          label: 'Owner',
          type: 'belongsTo',
          resourceLabel: 'name',
          resourceName: 'owners',
          views: {
            edit: {
              enable: true,
              nested: true
            },
            create: {
              enable: true,
              nested: true
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

SpecHelper.ownerConfiguration = {
      name: 'owners',
      label: 'Owner',
      identifier: 'id',
      actions: ['edit', 'create', 'show', 'delete'],
      fields: [
        {
          name:  'name',
          label: 'Name',
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
SpecHelper.Configuration = {
    getAppName: function() {
      return "Test";
    },
    getEntities: function () {
      return []; 
    },
    getEntity: function () {
      return SpecHelper.catConfiguration;
    }
  };
