angular.module('carnival')
.service('FieldParser', function () {

  var capitalizeFirstLetter = function(word){
    return word.charAt(0).toUpperCase() +
      word.substring(1);
  };

  var resolveForeignKey = function(field){
    if(field.foreignKey) 
      return field.foreignKey;
    if(!field.identifier)//TODO Is impossible to discover tthe foreignKey name without identifier
      return field.name;
    return  field.name + capitalizeFirstLetter(field.identifier);
  };

  this.prepare = function(field){
    if(field.type != 'belongsTo')
      return field;

    field.foreignKey = resolveForeignKey(field);  
  };
});

