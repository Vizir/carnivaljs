angular.module('carnival')
.factory('EntityValidation', function () {

  var Validation = function (name, options) {
    // Check if name is empty
    if (!name)
      throw 'You must set a name for your entity';
    // Check if identifier is empty
    if (!options.identifier)
      throw 'You must set an identifier for the entity ' + name;
    // Check if fields is empty
    if (!options.fields)
      throw 'You must set the fields for the entity ' + this.name;
  };

  return Validation;

});
