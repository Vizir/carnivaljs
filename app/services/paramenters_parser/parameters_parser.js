angular.module('carnival')
.service('ParametersParser', function () {

  var capitalizeFirstLetter = function(word){
    return word.charAt(0).toUpperCase() +
      word.substring(1);
  };

  var resolveParameterName = function(field){
    if(field.type != 'belongsTo')
      return field.name;

    if(field.foreignKey) 
      return field.foreignKey;

    return  field.name + capitalizeFirstLetter(field.identifier);
  };

  var getParameterValue = function(field, paramValue){
    if(field.type != 'hasMany')
      return paramValue;

    var values = [];
    for(var i = 0; i < paramValue.length; i++){
      var val = paramValue[i];
      values.push(val[field.identifier]);
    }
    return values;
  };

  this.prepareForRequest = function(entity, data){
    var fields = entity.fields;
    var params = {};
    for(var i = 0; i < fields.length; i++){
      var field = fields[i];
      var paramValue = getParameterValue(field, data[field.name]);
      var paramName = resolveParameterName(field);
      params[paramName] = paramValue;
    }
    return params;
  };
});

