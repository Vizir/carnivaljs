angular.module('carnival')
.service('RequestBuilder', function (HttpAdapter) {

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
    if(params.offset)
      request.params.offset = params.offset;
    if(params.limit)
      request.params.limit  = params.limit;
    if (params.order && params.orderDir) {
      request.params.order    = params.order;
      request.params.orderDir = params.orderDir;
    }
    if (params.search)
      request.params.search = encodeURIComponent(JSON.stringify(params.search));
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
    request.data = params.entityData;
    return request;
  };

  this.buildForUpdate = function(params){
    var request = prebuildRequest('PUT', params);
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    request.data = params.entityData;
    return request;
  };
});

