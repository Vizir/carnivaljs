angular.module('carnival')
.filter('translate', function (Translation) {
  return function (value) {
    if (Translation.table && Translation.table[value]) {
      return Translation.table[value];
    }
    return Translation.defaults[value] || value;
  };
});
