angular.module('carnival')

.provider('HttpAdapter', function () {

  var httpMethods = {

    getList: null

  };

  return {

    /* The callback will receive the Api URL and the entity's Name */
    getList: function (callback) {
      httpMethods.getList = callback;
    },

    getOne: function (callback) {
      httpMethods.getOne = callback;
    },

    $get: function () {
      return httpMethods;
    }

  };

});
