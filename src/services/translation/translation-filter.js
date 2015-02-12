angular.module('carnival')
.filter('translate', function (Translation) {
  return function (value) {
    if (!Translation.table) { 
      return Translation.defaults[value] || value;
    }
    return  Translation.table[value] || value;
  };
});
