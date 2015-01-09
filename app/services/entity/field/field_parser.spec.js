describe('On Field Parser Service', function () {

  var FieldParser, field;

  beforeEach(function () {

    module('carnival');
    inject(function (_FieldParser_) {
      FieldParser = _FieldParser_;
    });

  });
  
  describe('simple field', function(){
    it('should prepare field', function () {
      var field = {
        type: 'string',
        name: 'field'
      };
      FieldParser.prepare(field);
      expect(!field.foreignKey).to.be.equal(true);
    });
  });

  describe('belongs to field', function(){

    it('should prepare field', function () {
      var field = {
        type: 'belongsTo',
        identifier: 'id',
        name: 'field'
      };
      FieldParser.prepare(field);
      expect(field.foreignKey).to.be.equal('fieldId');
    });

    describe('has a custom key', function(){
      it('should prepare field', function () {
        var field = {
          type: 'belongsTo',
          foreignKey: 'customId',
          identifier: 'id',
          name: 'field'
        };
        var parameters = FieldParser.prepare(field);
        expect(field.foreignKey).to.be.equal('customId');
      });
    });
  });
});
