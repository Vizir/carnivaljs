angular.module('carnival')
.factory('Entity', function (EntityValidation, $http, Configuration, RequestBuilder) {

  var buildViews = function (views) {
    var _views = {};
    Object.keys(views).forEach(function (view_name) {
      _views[view_name] = {
        enable:    views[view_name].enable,
        searchable: views[view_name].searchable || true,
        nested: views[view_name].nested || false,
        sortable:   views[view_name].sortable   || true
      };
    });
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
        from:       fields[field_name].from,
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
    this.extraListParams = options.extraListParams;
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
    var extraParams = this.extraListParams || {};
    var request = RequestBuilder.buildForGetList({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      offset: offset,
      limit: limit,
      order: order,
      orderDir: orderDir,
      search: search,
      endpoint: this.name
    });

    return $http(request);
  };

  Entity.prototype.getOne = function (id) {
    var request = RequestBuilder.buildForGetOne({
      baseUrl: Configuration.getBaseApiUrl(),
      id: id,
      endpoint: this.name
    });
    return $http(request);
  };

  Entity.prototype.delete = function (id) {
    var request = RequestBuilder.buildForDelete({
      baseUrl: Configuration.getBaseApiUrl(),
      id: id,
      endpoint: this.name
    });
    return $http(request);
  };

  Entity.prototype.create = function (data) {
    var request = RequestBuilder.buildForCreate({
      baseUrl: Configuration.getBaseApiUrl(),
      entity: this,
      entityData: data,
      endpoint: this.name
    });
    return $http(request);
  };

  Entity.prototype.update = function (id, data) {
    var request = RequestBuilder.buildForUpdate({
      baseUrl: Configuration.getBaseApiUrl(),
      id: id,
      entity: this,
      entityData: data,
      endpoint: this.name
    });
    return $http(request);
  };

  return Entity;

});
