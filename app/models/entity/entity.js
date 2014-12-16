angular.module('carnival')

.factory('Entity', function ($http, Configuration, HttpAdapter) {

  var buildFields = function (fields, that) {
    var _fields = [],
        _relations = [];

    Object.keys(fields).forEach(function (field_name) {

      _fields.push({
        name:         field_name,
        label:        fields[field_name].label,
        resourceName: fields[field_name].resourceName,
        type:         fields[field_name].type,
        views:        fields[field_name].views
      });

    });

    that.fields = _fields;
  };

  function Entity (name, options) {

    this.name = name;
    this.label = options.label || name;
    this.identifier = options.identifier;
    this.filters = options.filters;
    this.fields = [];
    buildFields(options.fields, this);

  }

  Entity.prototype.checkFieldView = function (name, view) {
    for (var i = 0, x = this.fields.length; i < x; i += 1) {
      if (this.fields[i].name === name) {
        return this.fields[i].views[view].enable;
      }
    }
    return false;
  };

  // $http services

  Entity.prototype.getList = function (offset, limit, order, orderDir, search) {
    var request    = { params: {} };
    request.method = 'GET';
    request.url    = Configuration.getBaseApiUrl() + '/' + this.name;
    request.params.offset = offset;
    request.params.limit  = limit;
    if (order && orderDir) {
      request.params.order    = order;
      request.params.orderDir = orderDir;
    }
    if (search) request.params.search = search;
    return $http(request);
  };

  Entity.prototype.getOne = function (id) {
    var request = {};
    request.method = 'GET';
    request.url = Configuration.getBaseApiUrl() + '/' + this.name + '/' + id;
    return $http(request);
  };

  Entity.prototype.delete = function (id) {
    var request = {};
    request.method = 'DELETE';
    request.url = Configuration.getBaseApiUrl() + '/' + this.name + '/' + id;
    return $http(request);
  };

  Entity.prototype.create = function (data) {
    var request = {};
    request.method = 'POST';
    request.url = Configuration.getBaseApiUrl() + '/' + this.name;
    request.data = data;
    return $http(request);
  };

  Entity.prototype.update = function (id, data) {
    var request = {};
    request.method = 'PUT';
    request.url = Configuration.getBaseApiUrl() + '/' + this.name + '/' + id;
    request.data = data;
    return $http(request);
  };

  return Entity;

});
