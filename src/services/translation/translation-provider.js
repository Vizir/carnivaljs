angular.module('carnival')
.provider('Translation', function (defaultTranslations) {
  
  var defaults = defaultTranslations; 
  var translationTable; 

  return {

    setTranslation: function (table) {
      translationTable = table;
    },

    $get: function () {
      return {
        defaults: defaults,
        table: translationTable 
      };
    }

  };

});
