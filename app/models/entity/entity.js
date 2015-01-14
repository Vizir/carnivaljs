angular.module('carnival')
.factory('Entity', function (EntityValidation, $http, Configuration, RequestBuilder, FieldBuilder) {

  var buildViews = function (views) {
    var _views = {};
    Object.keys(views).forEach(function (view_name) {
      _views[view_name] = {
        enable:     views[view_name].enable,
        searchable: views[view_name].searchable || true,
        nested:     views[view_name].nested || false,
        sortable:   views[view_name].sortable   || true
      };
    });
    return _views;
  };

  var buildFields = function (fields, that) {
    var _fields = [];

    Object.keys(fields).forEach(function (field_name) {
      var field = FieldBuilder.build(field_name, fields[field_name]);
      _fields.push(field);
    });

    that.fields = _fields;
  };

  function Entity (name, options) {
    if (Configuration.validateEntities) EntityValidation(name, options);
    this.name = name;
    this.label          = options.label || this.name;
    this.identifier     = options.identifier;
    this.extraReqParams = options.extraReqParams || {};
    this.quickFilters   = options.quickFilters   || null;
    this.pagination     = options.pagination     || null;
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

  Entity.prototype.getFieldByEntityName = function (entityName){
    for(var i = 0; i < this.fields.length; i++){
      if(this.fields[i].entityName === entityName)
        return this.fields[i];
    }
  };

  // $http services

  Entity.prototype.getList = function (offset, limit, order, orderDir, search) {
    var extraParams = this.extraReqParams.list || {};
    var requestParams = RequestBuilder.buildForGetList({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      offset: offset,
      entity: this,
      limit: limit,
      order: order,
      orderDir: orderDir,
      search: search,
      endpoint: this.name
    });

    return this.request(requestParams);
  };

  Entity.prototype.getOne = function (id) {
    var extraParams = this.extraReqParams.show || {};
    var requestParams = RequestBuilder.buildForGetOne({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      id: id,
      endpoint: this.name
    });
    return this.request(requestParams);
  };

  Entity.prototype.delete = function (id) {
    var extraParams = this.extraReqParams.delete || {};
    var requestParams = RequestBuilder.buildForDelete({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      id: id,
      endpoint: this.name
    });
    return this.request(requestParams);
  };

  Entity.prototype.create = function (data) {
    var extraParams = this.extraReqParams.create || {};
    var requestParams = RequestBuilder.buildForCreate({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      entity: this,
      entityData: data,
      endpoint: this.name
    });
    return this.request(requestParams);
  };

  Entity.prototype.update = function (id, data) {
    var extraParams = this.extraReqParams.update || {};
    var requestParams = RequestBuilder.buildForUpdate({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      id: id,
      entity: this,
      entityData: data,
      endpoint: this.name
    });
    return this.request(requestParams);
  };

  Entity.prototype.request = function(requestParams){
    return $http(requestParams);
  };

  return Entity;

});
