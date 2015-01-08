describe('On Request Builder Service', function () {
  var RequestBuilder, Configuration, 
      HttpAdapter, ParametersParser;
  
  beforeEach(function () {

    module('carnival');
    inject(function (_Configuration_, _RequestBuilder_, _HttpAdapter_, _ParametersParser_) {
      RequestBuilder = _RequestBuilder_;
      Configuration = _Configuration_;
      HttpAdapter = _HttpAdapter_;
      ParametersParser = _ParametersParser_;
    });

    sinon.stub(Configuration, 'getBaseApiUrl', function(){
      return "http://api.url/";
    });

    sinon.stub(ParametersParser, 'prepareForRequest', function(){
      return {key: 'value'};
    });
  });

  describe('build for getList', function(){
    var requestParams = {};
    beforeEach(function(){
      requestParams = {
        baseUrl: Configuration.getBaseApiUrl(),
        offset: 'offset',
        limit: 'limit',
        order: 'order',
        orderDir: 'orderDir',
        search: 'search',
        endpoint: 'endpoint'
      };
    
    });
    it('should return correct request', function(){
      var request = RequestBuilder.buildForGetList(requestParams);
      expect(request.method).to.be.equal('GET');
      expect(request.url).to.be.equal(Configuration.getBaseApiUrl() + "/" + requestParams.endpoint );
      expect(request.params.offset).to.be.equal('offset');
      expect(request.params.limit).to.be.equal('limit');
      expect(request.params.order).to.be.equal('order');
      expect(request.params.orderDir).to.be.equal('orderDir');
      var searchParam = encodeURIComponent(JSON.stringify('search'));
      expect(request.params.search).to.be.equal(searchParam);
    }); 

    describe('extraParams', function(){
      it('should return correct request', function(){
        requestParams.extraParams = {
          extra1: 1,
          extra2: 2
        };
        var request = RequestBuilder.buildForGetList(requestParams);
        expect(request.method).to.be.equal('GET');
        expect(request.url).to.be.equal(Configuration.getBaseApiUrl() + "/" + requestParams.endpoint );
        expect(request.params.offset).to.be.equal('offset');
        expect(request.params.limit).to.be.equal('limit');
        expect(request.params.order).to.be.equal('order');
        expect(request.params.orderDir).to.be.equal('orderDir');
        expect(request.params.extra1).to.be.equal(1);
        expect(request.params.extra2).to.be.equal(2);
        var searchParam = encodeURIComponent(JSON.stringify('search'));
        expect(request.params.search).to.be.equal(searchParam);
      }); 
    });
  });


  describe('build for getOne', function(){
    it('should return correct request', function(){
      var requestParams = {
        baseUrl: Configuration.getBaseApiUrl(),
        id: 'id',
        endpoint: 'endpoint'
      };
      var request = RequestBuilder.buildForGetOne(requestParams);
      expect(request.method).to.be.equal('GET');
      expect(request.url).to.be.equal(Configuration.getBaseApiUrl() + "/" + requestParams.endpoint + '/' + requestParams.id );
    }); 
  });

  describe('build for delete', function(){
    it('should return correct request', function(){
      var requestParams = {
        baseUrl: Configuration.getBaseApiUrl(),
        id: 'id',
        endpoint: 'endpoint'
      };
      var request = RequestBuilder.buildForDelete(requestParams);
      expect(request.method).to.be.equal('DELETE');
      expect(request.url).to.be.equal(Configuration.getBaseApiUrl() + "/" + requestParams.endpoint + '/' + requestParams.id );
    }); 
  });

  describe('build for create', function(){
    it('should return correct request', function(){
      var requestParams = {
        baseUrl: Configuration.getBaseApiUrl(),
        entityData: {key: 'value'},
        entity: {},
        endpoint: 'endpoint'
      };
      var request = RequestBuilder.buildForCreate(requestParams);
      expect(request.method).to.be.equal('POST');
      expect(request.url).to.be.equal(Configuration.getBaseApiUrl() + "/" + requestParams.endpoint);
      expect(request.data !== null).to.be.equal(true);
    }); 
  });

  describe('build for update', function(){
    it('should return correct request', function(){
      var requestParams = {
        baseUrl: Configuration.getBaseApiUrl(),
        id: 'id',
        entityData: {key: 'value'},
        entity: {},
        endpoint: 'endpoint'
      };
      var request = RequestBuilder.buildForUpdate(requestParams);
      expect(request.method).to.be.equal('PUT');
      expect(request.url).to.be.equal(Configuration.getBaseApiUrl() + "/" + requestParams.endpoint + '/' + requestParams.id);
      expect(request.data !== null).to.be.equal(true);
    }); 
  });

});

