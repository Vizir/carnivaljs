angular.module('carnival')
.service('FieldBuilder', function () {

  var buildViews = function (views) {
    var _views = {};
    Object.keys(views).forEach(function (view_name) {
      var view_options = views[view_name];
      _views[view_name] = {
        enable:    view_options.enable,
        searchable: typeof view_options.searchable === 'boolean' ? view_options.searchable : true,
        showOptions: view_options.showOptions || false,
        enableDelete: view_options.enableDelete || false,
        nested: view_options.nested || false,
        sortable: typeof view_options.sortable === 'boolean' ? view_options.sortable : true
      };
    });
    return _views;
  };

  var capitalizeFirstLetter = function(word){
    return word.charAt(0).toUpperCase() +
      word.substring(1);
  };

  var resolveForeignKey = function(field){
    if(field.type !== 'belongsTo' && field.type !== 'hasMany')
      return;
    if(field.foreignKey)
      return field.foreignKey;
    if(!field.identifier)//TODO Is impossible to discover tthe foreignKey name without identifier
      return field.name;
    return field.name + capitalizeFirstLetter(field.identifier);
  };

  var parseGrid = function (grid) {
    var rowSplitted = grid.split(' ');
    var newRow = rowSplitted[0] === 'row' ? true : false;
    if (rowSplitted[0] === 'row') rowSplitted.splice(0, 1);
    var columnSplitted = rowSplitted[0].split('-');
    var columnSize = columnSplitted[0] === 'column' ? columnSplitted[1] : '12';
    return {
      newRow: newRow,
      columnSize: columnSize
    };
  };

  this.build = function(field_name, fieldParams){
    var field = {
      name:       field_name,
      label:      fieldParams.label || field_name,
      foreignKey: fieldParams.foreignKey,
      endpoint:   fieldParams.endpoint || field_name,
      field:      fieldParams.field,
      identifier: fieldParams.identifier || 'id',
      entityName: fieldParams.entityName || field_name,
      type:       fieldParams.type,
      uploader:   fieldParams.uploader,
      gallery:    fieldParams.gallery,
      values:     fieldParams.values,
      grid:       parseGrid(fieldParams.grid || 'row column-12'),
      options:    fieldParams.options,
      views:      buildViews(fieldParams.views)
    };

     field.foreignKey = resolveForeignKey(field);

    return field;
  };
});
