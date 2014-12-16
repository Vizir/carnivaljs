angular.module('carnival').provider('Configuration', function() {

  var appName = null;
  var baseApiUrl = null;
  var entities = [];

  return {
    setBaseApiUrl: function (url) {
      url.replace(/\/$/, '');
      baseApiUrl = url;
    },

    setAppName: function (name) {
      appName = name;
    },
    
    setEntities: function(entities) {
      entities = entities;
    },

    addEntity: function (entityName, entityOptions) {
      entities.push({ name: entityName, options: entityOptions });
    },

    $get: function () {
      return {

        entities: entities,

        getBaseApiUrl: function () {
          return baseApiUrl;
        },

        getAppName: function () {
          return appName;
        },

        getEntity: function (entityName) {
          for (var i = 0, x = entities.length; i < x; i += 1) {
            if (entities[i].name === entityName) {
              return entities[i];
            }
          }
          return 'Entity not found!';
        },

        getEntities: function () {
          return entities;
        }

      };
    }

  };

});
