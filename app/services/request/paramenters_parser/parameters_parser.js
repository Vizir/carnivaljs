angular.module('carnival')
.service('ParametersParser', function () {

  var getFieldByName = function(name, fields){
    
    for(var i = 0; i < fields.length; i++){
      var field = fields[i];
      if(field.name === name)
        return field;
    }

    return null;
  };

  var buildHasManyParams = function(field, values){
    var params = [];
    for(var i = 0; i < values.length; i++){
      var value = values[i];
      params.push(value[field.identifier]);
    }
    return params;
  };

  this.parse = function(params, entity){
    var parsedParams = {};
    for(var paramName in params){
      var field = getFieldByName(paramName, entity.fields);
      if(!field || field.type != 'hasMany'){
        parsedParams[paramName] = params[paramName]; 
        continue;
      }
      
      parsedParams[paramName] = buildHasManyParams(field, params[paramName]);
    }
    return parsedParams; 
  };
});
