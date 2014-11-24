define(function () {

  var ApiConfig = function () {
    
    var baseApiUrl = null;

    return {

      setBaseApiUrl: function (url) {
        url.replace(/\/$/, '');
        baseApiUrl = url;
      },

      $get: function () {
        return {

          getBaseApiUrl: function () {
            return baseApiUrl;
          }

        };
      }

    };

  };

  return ApiConfig;

});