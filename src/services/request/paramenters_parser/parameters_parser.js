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

  var getFieldByEntityName = function(entityName, fields){

    for(var i = 0; i < fields.length; i++){
      var field = fields[i];
      if(field.entityName === entityName)
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

  var buildParentEntityParams = function(entity){
    var parsedParams = {};
    var parentEntity = entity.parentEntity;
    if(!parentEntity)
      return parsedParams;
    var field = getFieldByEntityName(parentEntity.name, entity.fields);
    if(!field)
      return {};
    if(field.type === 'hasMany'){
      parsedParams[field.name] = buildHasManyParams(field, [parentEntity.datas]);
    }else if(field.type === 'belongsTo'){
      parsedParams[field.foreignKey] = parentEntity.datas[field.identifier];
    }

    return parsedParams;
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

    var parentEntityParams = buildParentEntityParams(entity);
    return angular.extend(parsedParams, parentEntityParams);
  };
});
