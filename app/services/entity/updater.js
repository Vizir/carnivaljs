angular.module('carnival')
.service('EntityUpdater', function () {
  this.updateEntity = function(entity, fieldToUpdate, fieldData){
    if(fieldToUpdate.type === 'belongsTo'){
      entity.datas[fieldToUpdate.name] = fieldData;
      entity.relatedResources[fieldToUpdate.endpoint].push(fieldData);
    }else if(fieldToUpdate.type === 'hasMany'){
      entity.datas[fieldToUpdate.name].push(fieldData);
      entity.relatedResources[fieldToUpdate.endpoint].push(fieldData);
    }
  };
});
