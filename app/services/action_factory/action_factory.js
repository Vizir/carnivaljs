angular.module('carnival')
.service('ActionFactory', function (Notification, $state, ParametersParser, EntityUpdater) {

  this.buildCreateFunction = function(entity, hasNestedForm, isToNestedForm){
    return function () {
      entity.model.create(ParametersParser.parse(entity.datas, entity))
      .success(function (data, status, headers, config) {
        if(isToNestedForm){
          var parentEntity = entity.parentEntity;
          var fieldToUpdate = parentEntity.model.getFieldByEntityName(entity.name);
          EntityUpdater.updateEntity(parentEntity, fieldToUpdate, data);
        }
        else{
          new Notification('Item created with success!', 'success');
          if(hasNestedForm)
            $state.go('main.edit', { entity: entity.model.name, id: data.id });
          else
            $state.go('main.list', { entity: entity.model.name });
        }
      })
      .error(function (data) {
        new Notification(data, 'danger');
      });
    };
  };

  this.buildEditFunction = function(entity){
    return function () {
      entity.model.update(entity.id, ParametersParser.parse(entity.datas, entity))
      .success(function () {
        new Notification('Modifications saved with success!', 'success');
        $state.go('main.show', { entity: entity.model.name, id: entity.id });
      })
      .error(function (data) {
        new Notification(data, 'danger');
      });
    };
  };

  this.buildShowFunction = function(entity){
    return function () {
      $state.go('main.edit', { entity: entity.model.name, id:entity.id });
    };
  };


  this.buildListFunction = function(entity){
    var onCreate = function () {
      $state.go('main.create', { entity: entity.name });
    };

    var onEdit = function (id) {
      $state.go('main.edit', { entity: entity.name, id: id });
    };

    var onShow = function (id) {
      $state.go('main.show', { entity: entity.name, id: id });
    };

    var onDelete = function (id) {
      entity.model.delete(id)
      .success(function () {
        new Notification('Item deleted with success!', 'warning');
        $state.reload();
      })
      .error(function (data) {
        new Notification(data, 'danger');
      });
    };

    return {
      create: onCreate,
      edit: onEdit,
      show: onShow,
      delete: onDelete
    };
  };

  this.buildAction = function(entity, stateName, isToNestedForm){
    switch (stateName) {
      case 'create':
        return {
          name: 'action',
          value: {
            label: "Save",
            click: this.buildCreateFunction(entity, Object.keys(entity.nestedForms).length > 0, isToNestedForm)
          }
        };

      case 'edit':
        return {
          name: 'action',
          value: {
            label: "Save",
            click: this.buildEditFunction(entity)
          }
        };

      case 'show':
        return {
          name: 'action',
          value: {
            label: "Edit",
            click: this.buildShowFunction(entity)
          }
        };

      case 'index':
        return {
          name: 'actions',
          value: this.buildListFunction(entity)
        };
      default:
        return {};
    }
  };
});
