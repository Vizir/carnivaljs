angular.module('carnival').provider('Configuration', function() {

  var appName = null;
  var baseApiUrl = null;
  var validateEntities = false;
  var entities = [];
  var navbar = [];

  return {
    setBaseApiUrl: function (url) {
      url.replace(/\/$/, '');
      baseApiUrl = url;
    },

    setAppName: function (name) {
      appName = name;
    },

    validateEntities: function (validate) {
      if (validate) validateEntities = true;
    },

    setEntities: function(entities) {
      entities = entities;
    },

    addEntity: function (entityName, entityOptions) {
      entities.push({ name: entityName, options: entityOptions });
    },

    addNavbarItem: function (options) {
      navbar.push(options);
    },

    $get: function () {
      return {

        entities: entities,

        validateEntities: validateEntities,

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
        },

        getNavbarItems: function () {
          return navbar;
        }

      };
    }

  };

});
