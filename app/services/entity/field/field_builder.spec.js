describe('On Field Builder Service', function () {

  var FieldBuilder, fieldParams;

  beforeEach(function () {

    module('carnival');
    inject(function (_FieldBuilder_) {
      FieldBuilder = _FieldBuilder_;
    });

    fieldParams = {
      type:       'string',
      label:      'label',
      endpoint:   'endpoint',
      field:      'field',
      identifier: 'identifier',
      views:      {index:{enable: true}}
    };

  });
  
  describe('simple field', function(){
    it('should build field', function () {
      var field = FieldBuilder.build('fieldName', fieldParams);
      expect(!field.foreignKey).to.be.equal(true);
      expect(field.type).to.be.equal('string');
      expect(field.label).to.be.equal('label');
      expect(field.endpoint).to.be.equal('endpoint');
      expect(!field.views).to.be.equal(false);
    });
  });

  describe('belongs to field', function(){

    it('should build field', function () {
      fieldParams.type = 'belongsTo';
      fieldParams.identifier= 'id';
      var field = FieldBuilder.build('fieldName', fieldParams);
      expect(field.foreignKey).to.be.equal('fieldNameId');
    });

    describe('has a custom key', function(){
      it('should build field', function () {
        fieldParams.type = 'belongsTo';
        fieldParams.identifier= 'id';
        fieldParams.foreignKey = 'customId';
        var field = FieldBuilder.build('fieldName', fieldParams);
        expect(field.foreignKey).to.be.equal('customId');
      });
    });
  });
});
