angular.module('carnival')
.service('FieldBuilder', function () {

  var buildViews = function (views) {
    var _views = {};
    Object.keys(views).forEach(function (view_name) {
      _views[view_name] = {
        enable:    views[view_name].enable,
        searchable: views[view_name].searchable || true,
        nested: views[view_name].nested || false,
        sortable:   views[view_name].sortable   || true
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

  this.build = function(field_name, fieldParams){
    var field = {
      name:       field_name,
      label:      fieldParams.label,
      foreignKey: fieldParams.foreignKey,
      endpoint:   fieldParams.endpoint,
      field:      fieldParams.field,
      identifier: fieldParams.identifier,
      from:       fieldParams.from,
      type:       fieldParams.type,
      views:      buildViews(fieldParams.views),
      uploader:   fieldParams.uploader 
    };

     field.foreignKey = resolveForeignKey(field);

    return field;
  };
});
