angular.module('carnival.services')

.provider('Api', function () {

  var appName = null;
  var baseApiUrl = null;
  var appLanguage = 'en';

  return {

    setBaseApiUrl: function (url) {
      url.replace(/\/$/, '');
      baseApiUrl = url;
    },

    setAppName: function (name) {
      appName = name;
    },

    setLanguage: function (lang) {
      appLanguage = lang;
    },

    $get: function () {
      return {

        getBaseApiUrl: function () {
          return baseApiUrl;
        },

        getAppName: function () {
          return appName;
        },

        getLanguage: function () {
          return appLanguage;
        }

      };
    }

  };

});
