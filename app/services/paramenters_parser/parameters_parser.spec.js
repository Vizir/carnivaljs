describe('On Parameters Parser Service', function () {

  var ParametersParser;

  beforeEach(function () {

    module('carnival');
    inject(function (_ParametersParser_) {
      ParametersParser = _ParametersParser_;
    });
    data = {param1: 'param1', param2: 'param2'};
    entity = {
      fields:[
        { name: 'param1', type: 'string'},
        { name: 'param2', type: 'string'}
      ]
    };
  });
  
  describe('only simple fields', function(){
    it('should return the correct parameters', function () {
      var parameters = ParametersParser.prepareForRequest(entity, data);
      expect(parameters.param1).to.be.equal('param1');
      expect(parameters.param2).to.be.equal('param2');
    });
  });

  describe('belongs to field', function(){
    var belongsToField = {};
    beforeEach(function(){
      data.belongsTo = 1;
      belongsToField = {
        name: 'belongsTo',
        type: 'belongsTo',
        identifier: 'id'
      };
      entity.fields.push(belongsToField);
    });

    it('should return the correct parameters', function () {
      var parameters = ParametersParser.prepareForRequest(entity, data);
      expect(parameters.param1).to.be.equal('param1');
      expect(parameters.param2).to.be.equal('param2');
      expect(parameters.belongsToId).to.be.equal(1);
    });

    describe('has a custom key', function(){
      it('should return the correct parameters', function () {
        belongsToField.foreignKey = 'customKey';
        var parameters = ParametersParser.prepareForRequest(entity, data);
        expect(parameters.param1).to.be.equal('param1');
        expect(parameters.param2).to.be.equal('param2');
        expect(parameters.customKey).to.be.equal(1);
      });
    });
  });

  describe('hasMany field', function(){
    var hasManyField = {};
    beforeEach(function(){
      data.comments =[{id: 1, comment: 'Comment'}];
      hasManyField = {
        name: 'comments',
        type: 'hasMany',
        identifier: 'id'
      };
      entity.fields.push(hasManyField);
    });

    it('should return the correct parameters', function () {
      var parameters = ParametersParser.prepareForRequest(entity, data);
      expect(parameters.param1).to.be.equal('param1');
      expect(parameters.param2).to.be.equal('param2');
      expect(parameters.comments[0]).to.be.equal(1);
    });
  });

});
