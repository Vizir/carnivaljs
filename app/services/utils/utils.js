angular.module('carnival')
.service('utils', function () {

  var cutString = function (str, n, etc) {
    if (!n) return str;
    if (!str) return new Error('cutString: to cut a string you must pass a string!');
    if (str.length <= n) return str;

    var result = '';
    for (var i = 0; i < n; i += 1) {
      result += str[i];
    }

    if (etc) result += '...';
    return result;
  };

  return {
    cutString: cutString
  };

});
