describe('On ParametersParse Service', function () {
  var ParametersParser, params, entity; 

  beforeEach(function () {
    module('carnival');
    inject(function (_ParametersParser_) {
      ParametersParser = _ParametersParser_;
    });

    params = {
      title: 'Titulo',
      content: 'Conteudo',
      tags: [
        {id: 1, name: 'tag1'},
        {id: 2, name: 'tag2'}
      ]
    };
    entity = {

      fields: [
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'content',
          type: 'text'
        },
        {
          name: 'tags',
          type: 'hasMany',
          identifier: 'id'
        }
      ]
    };
  });

  describe('parse has many parameters', function(){
    
    it('should parse correctly', function(){
      var parsedParams = ParametersParser.parse(params, entity);
      console.log("ParsedParams", parsedParams);
      expect(parsedParams.tags[0]).to.be.equal(1);
      expect(parsedParams.tags[1]).to.be.equal(2);
    });

  });

});
