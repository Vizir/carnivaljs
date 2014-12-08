angular.module('carnival')

.factory('EntityModel', function ($http, Configuration, HttpAdapter) {

  var buildFields = function (fields, that) {
    var _fields = [],
        _relations = [];

    Object.keys(fields).forEach(function (field_name) {

      _fields.push({
        name:  field_name,
        label: fields[field_name].label,
        type:  fields[field_name].type,
        views: fields[field_name].views
      });

    });

    that.fields = _fields;
  };

  function Entity (name, options) {

    this.name = name;
    this.label = options.label || name;
    this.identifier = options.identifier;
    this.actions = options.actions || ['edit', 'create', 'show', 'delete'];
    this.fields = [];
    this.relations = [];
    buildFields(options.fields, this);

  }

  Entity.prototype.checkFieldView = function (name, view) {
    for (var i = 0, x = this.fields.length; i < x; i += 1) {
      if (this.fields[i].name === name) {
        if (this.fields[i].views[view].enable) {
          return true;
        }
      }
    }
    return false;
  };

  Entity.prototype.checkAction = function (action) {
    return this.actions.indexOf(action) >= 0 ? true : false;
  };

  // http

  Entity.prototype.getList = function () {
    var request = {};
    if (typeof HttpAdapter.getList === 'function') {
      request = HttpAdapter.getList(Configuration.getBaseApiUrl(), this.name);
    } else {
      request.query = Configuration.getBaseApiUrl() + '/' + this.name;
      request.options = {};
    }
    return $http.get(request.query, request.options);
  };

  Entity.prototype.getOne = function (id) {
    var request = {};
    if (typeof HttpAdapter.getOne === 'function') {
      request = HttpAdapter.getOne(Configuration.getBaseApiUrl(), this.name, id);
    } else {
      request.query = Configuration.getBaseApiUrl() + '/' + this.name + '/' + id;
      request.options = {};
    }
    return $http.get(request.query, request.options);
  };

  Entity.prototype.delete = function (id) {
    var request = {};
    if (typeof HttpAdapter.delete === 'function') {
      request = HttpAdapter.delete(Configuration.getBaseApiUrl(), this.name, id);
    } else {
      request.query = Configuration.getBaseApiUrl() + '/' + this.name + '/' + id;
      request.options = {};
    }
    return $http.delete(request.query, request.options);
  };

  Entity.prototype.create = function (data) {
    var request = {};
    if (typeof HttpAdapter.create === 'function') {
      request = HttpAdapter.create(Configuration.getBaseApiUrl(), this.name, data);
    } else {
      request.query = Configuration.getBaseApiUrl() + '/' + this.name;
      request.data = data;
      request.options = {};
    }
    return $http.post(request.query, request.data, request.options);
  };

  Entity.prototype.update = function (id, data) {
    var request = {};
    if (typeof HttpAdapter.update === 'function') {
      request = HttpAdapter.update(Configuration.getBaseApiUrl(), this.name, id, data);
    } else {
      request.query = Configuration.getBaseApiUrl() + '/' + this.name + '/' + id;
      request.data = data;
      request.options = {};
    }
    return $http.update(request.query, request.data = data, request.options);
  };

  Entity.prototype.getRelList = function (id, rel) {
    var request = {};
    if (typeof HttpAdapter.getRelList === 'function') {
      request = HttpAdapter.getRelList(Configuration.getBaseApiUrl(), this.name, id, rel);
    } else {
      request.query = Configuration.getBaseApiUrl() + '/' + this.name + '/' + id + '/' + rel;
    }
    return $http.get(request.query);
  };

  return Entity;

});
