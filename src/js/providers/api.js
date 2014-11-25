define(function () {

  var ApiConfig = function () {
    
    var appName = null;
    var baseApiUrl = null;

    var getBaseApiUrl = function () {
      return baseApiUrl;
    };

    return {

      setBaseApiUrl: function (url) {
        url.replace(/\/$/, '');
        baseApiUrl = url;
      },

      setAppName: function (name) {
        appName = name;
      },

      getBaseApiUrl: getBaseApiUrl,

      $get: function () {
        return {

          getBaseApiUrl: getBaseApiUrl,

          getAppName: function () {
            return appName;
          }

        };
      }

    };

  };

  return ApiConfig;

});