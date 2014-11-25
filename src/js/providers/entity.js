define(function () {

  var EntityConfig = function () {

    var entities = [];
    var Entity = require('models/entity.js');

    return {
      
      addEntity: function (entityName, entityOptions) {
        entities.push(new Entity(entityName, entityOptions));
      },

      $get: function () {
        return {

          getEntity: function (entityName) {
            for (var i = 0, x = entities.length; i < x; i += 1) {
              if (entities[i].name === entityName) {
                return entities[i];
              }
            }
          },

          getEntities: function () {
            return entities;
          }

        };
      }

    };

  };

  return EntityConfig;

});