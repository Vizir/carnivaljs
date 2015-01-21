angular.module('carnival')
.service('utils', function () {

  var cutString = function (str, n) {
    if (!n) return str;
    if (!str) throw 'cutString: to cut a string you must pass a string!';
    if (str.length <= n) return str;
    if (typeof str !== 'string') return str;
    str = str.substr(0, n - 1) + '...';
    return str;
  };

  return {
    cutString: cutString
  };

});
