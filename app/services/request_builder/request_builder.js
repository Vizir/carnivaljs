angular.module('carnival')
.service('RequestBuilder', function (HttpAdapter, ParametersParser) {
  
  var prebuildRequest = function(method){
    var request = {};
    request.method = method;
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
    var request = prebuildRequest('GET');
    request.params = {};
    request.url    = params.baseUrl + '/' + params.endpoint;
    request.params.offset = params.offset;
    request.params.limit  = params.limit;
    if (params.order && params.orderDir) {
      request.params.order    = params.order;
      request.params.orderDir = params.orderDir;
    }
    
    addExtraParams(request, params.extraParams);

    if (params.search) request.params.search = encodeURIComponent(JSON.stringify(params.search));
    return request;
  };

  this.buildForGetOne = function(params){
    var request = prebuildRequest('GET');
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    return request;
  };

  this.buildForDelete = function(params){
    var request = prebuildRequest('DELETE');
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    return request;
  };

  this.buildForCreate = function(params){
    var request = prebuildRequest('POST');
    request.url    = params.baseUrl + '/' + params.endpoint;
    var parameters = ParametersParser.prepareForRequest(params.entity, params.entityData);
    request.data = parameters;
    return request;
  };

  this.buildForUpdate = function(params){
    var request = prebuildRequest('PUT');
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    var parameters = ParametersParser.prepareForRequest(params.entity, params.entityData);
    request.data = parameters;
    return request;
  };
});

