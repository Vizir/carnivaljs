angular.module('carnival')
.service('RequestBuilder', function (Configuration, HttpAdapter, ParametersParser) {
  
  var prebuildRequest = function(method){
    var request = {};
    request.method = method;
    return request;
  };

  this.buildForGetList = function(params){
    var request = prebuildRequest('GET');
    request.params = {};
    request.url    = Configuration.getBaseApiUrl() + '/' + params.endpoint;
    request.params.offset = params.offset;
    request.params.limit  = params.limit;
    if (params.order && params.orderDir) {
      request.params.order    = params.order;
      request.params.orderDir = params.orderDir;
    }
    if (params.search) request.params.search = encodeURIComponent(JSON.stringify(params.search));
    return request;
  };

  this.buildForGetOne = function(params){
    var request = prebuildRequest('GET');
    request.url    = Configuration.getBaseApiUrl() + '/' + params.endpoint + '/' + params.id;
    return request;
  };

  this.buildForDelete = function(params){
    var request = prebuildRequest('DELETE');
    request.url    = Configuration.getBaseApiUrl() + '/' + params.endpoint + '/' + params.id;
    return request;
  };

  this.buildForCreate = function(params){
    var request = prebuildRequest('POST');
    request.url    = Configuration.getBaseApiUrl() + '/' + params.endpoint;
    var parameters = ParametersParser.prepareForRequest(params.entity, params.entityData);
    request.data = parameters;
    return request;
  };

  this.buildForUpdate = function(params){
    var request = prebuildRequest('PUT');
    request.url    = Configuration.getBaseApiUrl() + '/' + params.endpoint + '/' + params.id;
    var parameters = ParametersParser.prepareForRequest(params.entity, params.entityData);
    request.data = parameters;
    return request;
  };
});

