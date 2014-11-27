define(function (require) {

  var buildFields = function (fields, that) {
    Object.keys(fields).forEach(function (field) {
      that.fields.push({
        name: field,
        type: fields[field].type || 'text',
        label: fields[field].label || field,
        views: fields[field].views || ['list', 'edit', 'create', 'delete']
      });
      if (fields[field].identifier) {
        that.identifier = field;
      }
      fields[field].views.forEach(function (view) {
        if (that.actions.indexOf(view) < 0) {
          that.actions.push(view);
        }
      });
    });
    if (!that.identifier) {
      that.identifier = 'id';
      that.fields.push({
        name: 'id',
        type: 'number',
        label: 'id',
        views: ['list', 'edit', 'create', 'delete']
      });
      that.actions = ['list', 'edit', 'create', 'delete'];
    }
  };

  var buildRelations = function (relations, that) {
    Object.keys(relations).forEach(function (relation) {
      that.relations.push({
        target: relation,
        type: relations[relation].type,
      });
    });
  };

  function Entity (name, options) {

    this.name = name;
    this.label = options.label;

    this.identifier = null;
    this.fields = [];
    this.actions = [];
    buildFields(options.fields, this);
    
    if (options.relations) {
      this.relations = [];
      buildRelations(options.relations, this);
      console.log(this.relations);
    }

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

  Entity.prototype.httpGet = function () {
    return $q(function (resolve, reject) {
    });
  };

  return Entity;

});