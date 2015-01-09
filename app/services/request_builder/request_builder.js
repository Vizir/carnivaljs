angular.module('carnival')
.service('RequestBuilder', function (HttpAdapter, ParametersParser) {
  
  var prebuildRequest = function(method, params){
    var request = {};
    request.params = {};
    request.method = method;
    addExtraParams(request, params.extraParams);
    return request;
  };

  var addExtraParams = function(request, extraParams){
    if(!extraParams)
      return;
    for(var key in extraParams){
      request.params[key] = extraParams[key];
    }
  };

  this.buildForGetList = function(params){
    var request = prebuildRequest('GET', params);
    request.url    = params.baseUrl + '/' + params.endpoint;
    request.params.offset = params.offset;
    request.params.limit  = params.limit;
    if (params.order && params.orderDir) {
      request.params.order    = params.order;
      request.params.orderDir = params.orderDir;
    }
    if (params.search) {
      var searchParams = ParametersParser.prepareForRequest(params.entity, params.search);
      request.params.search = encodeURIComponent(JSON.stringify(searchParams));
    }
    return request;
  };

  this.buildForGetOne = function(params){
    var request = prebuildRequest('GET', params);
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    return request;
  };

  this.buildForDelete = function(params){
    var request = prebuildRequest('DELETE', params);
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    return request;
  };

  this.buildForCreate = function(params){
    var request = prebuildRequest('POST', params);
    request.url    = params.baseUrl + '/' + params.endpoint;
    var parameters = ParametersParser.prepareForRequest(params.entity, params.entityData);
    request.data = parameters;
    return request;
  };

  this.buildForUpdate = function(params){
    var request = prebuildRequest('PUT', params);
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    var parameters = ParametersParser.prepareForRequest(params.entity, params.entityData);
    request.data = parameters;
    return request;
  };
});

