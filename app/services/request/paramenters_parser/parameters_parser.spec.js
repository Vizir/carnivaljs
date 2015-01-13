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
      name: 'posts',
      identifier: 'id',

      datas: {
        id: 1
      },

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
      expect(parsedParams.tags[0]).to.be.equal(1);
      expect(parsedParams.tags[1]).to.be.equal(2);
    });

  });

  describe('parse parent Entity parameters', function(){

    describe('hasMany relation', function(){
      var childEntity;
      beforeEach(function(){
        childEntity = {
          name: 'tags',
          fields: [
            {name: 'posts', entityName: 'posts' , type: 'hasMany', identifier: 'id' }
          ],
          parentEntity: entity
        };
      });

      it('should parse correctly', function(){
        var parsedParams = ParametersParser.parse({}, childEntity);
        expect(parsedParams.posts[0]).to.be.equal(1);
      });
    });

    describe('belongsTo relation', function(){
      var childEntity;
      beforeEach(function(){
        childEntity = {
          name: 'tags',
          fields: [
            {name: 'post', foreignKey: 'postId', entityName: 'posts', type: 'belongsTo', identifier: 'id' }
          ],
          parentEntity: entity
        };
      });
      it('should parse correctly', function(){
        var parsedParams = ParametersParser.parse({}, childEntity);
        expect(parsedParams.postId).to.be.equal(1);
      });
    });

  });

});
