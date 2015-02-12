angular.module('carnival')
.filter('translate', function (Translation) {
  return function (value) {

    console.log(Translation);
    if (!Translation.table) { 
      return Translation.defaults[value] || value;
    }
    return  Translation.table[translation] || value;
  }
});
