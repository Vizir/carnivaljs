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
          endpoint: 'owners',
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
      getAppName: function() {
        return "Test";
      },
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
    getNavbarItems: function () {
      return [
        { label: 'Banana', link: { type: 'entity', url: 'banana' } },
        { label: 'Apple',  link: { type: 'entity', url: 'apple' } },
        { label: 'Orange', link: { type: 'entity', url: 'orange' } },
        { label: 'Bacon',  link: { type: 'url',    url: 'http://bacon.com' } }
      ];
    },
    getEntity: function () {
      return SpecHelper.catConfiguration;
    }
  };
