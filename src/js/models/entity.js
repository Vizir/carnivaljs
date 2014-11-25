define(function (require) {

  function Entity (name, options) {

    var that = this;

    this.name = name;
    this.label = options.label;
    this.actions = [];
    this.fields = [];
    Object.keys(options.fields).forEach(function (field) {
      that.fields.push({
        name: field,
        type: options.fields[field].type || 'text',
        label: options.fields[field].label || field,
        views: options.fields[field].views || ['list', 'edit', 'create', 'delete']
      });
      options.fields[field].views.forEach(function (view) {
        if (that.actions.indexOf(view) < 0) {
          that.actions.push(view);
        }
      });
    });
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