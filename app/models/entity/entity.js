angular.module('carnival')
.factory('Entity', function (EntityValidation, $http, Configuration, HttpAdapter) {

  var buildViews = function (views) {
    var _views = {};
    Object.keys(views).forEach(function (view_name) {
      _views[view_name] = {
        enable:    views[view_name].enable,
        searchable: views[view_name].searchable || true,
        sortable:   views[view_name].sortable   || true
      };
    });
    console.log(_views);
    return _views;
  };

  var buildFields = function (fields, that) {
    var _fields = [];

    Object.keys(fields).forEach(function (field_name) {

      _fields.push({
        name:       field_name,
        label:      fields[field_name].label,
        endpoint:   fields[field_name].endpoint,
        field:      fields[field_name].field,
        identifier: fields[field_name].identifier,
        type:       fields[field_name].type,
        views:      buildViews(fields[field_name].views)
      });

    });

    that.fields = _fields;
  };

  function Entity (name, options) {
    if (Configuration.validateEntities) EntityValidation(name, options);
    this.name = name;
    this.label = options.label || this.name;
    this.identifier = options.identifier;
    this.quickFilters = options.quickFilters || null;
    this.pagination = options.pagination || null;

    this.fields = [];
    buildFields(options.fields, this);

  }

  Entity.prototype.checkFieldView = function (name, view) {
    for (var i = 0, x = this.fields.length; i < x; i += 1) {
      if (this.fields[i].name === name) {
        return this.fields[i].views[view] && this.fields[i].views[view].enable;
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
    if (search) request.params.search = encodeURIComponent(JSON.stringify(search));
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
