angular.module('entity', [])

.provider('Entity', function () {

  var buildFields = function (fields, that) {

    Object.keys(fields).forEach(function (field) {
             
      that.fields.push({
        name: field,
        endpoint: fields[field].endpoint || field,
        foreignKey: fields[field].foreignKey,
        type: fields[field].type || 'text',
        label: fields[field].label || field,
        views: fields[field].views || ['list', 'edit', 'create', 'delete']
      });
      
      if (fields[field].identifier && !(fields[field].type === 'hasMany' || fields[field].type === 'belongsTo')) {
        that.identifier = field;
      }

      if (fields[field].type === 'hasMany' || fields[field].type === 'belongsTo') {
        
        that.relations.push({
          name: field,
          endpoint: fields[field].endpoint || field,
          foreignKey: fields[field].foreignKey,
          type: fields[field].type,
          label: fields[field].label || field,
          views: fields[field].views || ['edit', 'show']
        });
      
      }
          
      fields[field].views.forEach(function (view) {
        if (that.actions.indexOf(view) < 0) {
          that.actions.push(view);
        }
      });
    
    });
  
  };

  function Entity (name, options) {

    this.name = name;
    this.label = options.label;

    this.identifier = null;
    this.fields = [];
    this.actions = [];
    this.relations = [];
    buildFields(options.fields, this);

  }

  Entity.prototype.checkFieldView = function (field, view) {
    var _field;
    for (var i = 0, x = this.fields.length; i < x; i += 1) {
      if (this.fields[i].name === field) {
        _field = this.fields[i];
      }
    }
    if (_field.views.indexOf(view) >= 0) {
      return true;
    }
    return false;
  };

  Entity.prototype.checkEntityAction = function (action) {
    return (this.actions.indexOf(action) >= 0) ? true : false;
  };

  var entities = [];

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
          return 'Entity not found!';
        },

        getEntities: function () {
          return entities;
        }

      };
    }

  };

});