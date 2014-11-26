define(function () {

  var ApiConfig = function () {
    
    var appName = null;
    var baseApiUrl = null;

    return {

      setBaseApiUrl: function (url) {
        url.replace(/\/$/, '');
        baseApiUrl = url;
      },

      setAppName: function (name) {
        appName = name;
      },

      $get: function () {
        return {

          getBaseApiUrl: function () {
            return baseApiUrl;
          },

          getAppName: function () {
            return appName;
          }

        };
      }

    };

  };

  return ApiConfig;

});