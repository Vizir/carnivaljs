angular.module('carnival')
.service('EntityUpdater', function () {

  var isEditData = function(entity, fieldToUpdate, fieldData){
    var entityDatas = entity.datas[fieldToUpdate.name];
    for(var i = 0; i < entityDatas.length; i++){
      var data = entityDatas[i];
      if(data[fieldToUpdate.identifier] === fieldData[fieldToUpdate.identifier])
        return true;
    }
    return false;
  };

  var updateData = function(entity, fieldToUpdate, fieldData){
    updateList(entity, fieldToUpdate, fieldData, entity.datas[fieldToUpdate.name]);
  };

  var updateResources = function(entity, fieldToUpdate, fieldData){
    updateList(entity, fieldToUpdate, fieldData, entity.relatedResources[fieldToUpdate.endpoint]);
  };

  var updateList = function(entity, fieldToUpdate, fieldData, listToUpdated){
    for(var i = 0; i < listToUpdated.length; i++){
      var data = listToUpdated[i];
      if(data[fieldToUpdate.identifier] === fieldData[fieldToUpdate.identifier])
      {
        for(var key in data)
          data[key] = fieldData[key];
        break;
      }
    }
  };

  var addOrUpdateData = function(entity, fieldToUpdate, fieldData){
    var entityDatas = entity.datas[fieldToUpdate.name];
    if(isEditData(entity, fieldToUpdate, fieldData)){
      updateData(entity, fieldToUpdate, fieldData);
      updateResources(entity, fieldToUpdate, fieldData);
    }else{
      entityDatas.push(fieldData);
      entity.relatedResources[fieldToUpdate.endpoint].push(fieldData);
    }
  };

  this.updateEntity = function(entity, fieldToUpdate, fieldData){

    if(fieldToUpdate.type === 'belongsTo'){
      entity.datas[fieldToUpdate.name] = fieldData;
      entity.relatedResources[fieldToUpdate.endpoint].push(fieldData);
    }else if(fieldToUpdate.type === 'hasMany'){
      if(!entity.datas[fieldToUpdate.name])
        entity.datas[fieldToUpdate.name] = [];

      addOrUpdateData(entity, fieldToUpdate, fieldData);
    }
  };
});
