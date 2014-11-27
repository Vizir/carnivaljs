define(function (require) {

  function Entity (name, options) {

    var that = this;

    this.name = name;
    this.label = options.label;
    this.identifier = null;
    this.actions = [];
    this.fields = [];
    this.relations = [];

    Object.keys(options.fields).forEach(function (field) {

      that.fields.push({
        name: field,
        type: options.fields[field].type || 'text',
        label: options.fields[field].label || field,
        views: options.fields[field].views || ['list', 'edit', 'create', 'delete']
      });

      if (options.fields[field].identifier) {
        that.identifier = field;
      }

      options.fields[field].views.forEach(function (view) {
        if (that.actions.indexOf(view) < 0) {
          that.actions.push(view);
        }
      });

    });

    if (!this.identifier) {
      this.identifier = 'id';
      this.fields.push({
        name: 'id',
        type: 'number',
        label: 'id',
        views: ['list', 'edit', 'create', 'delete']
      });
      this.actions = ['list', 'edit', 'create', 'delete'];
    }

    if (options.relations) {
      Object.keys(options.relations).forEach(function (relation) {
        that.relations.push({
          target: relation,
          type: options.relations[relation].type,
        });
      });
    }

    console.log(this.relations);

  }

  Entity.prototype.getFields = function () {
    return this.fields;
  };

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

  return Entity;

});