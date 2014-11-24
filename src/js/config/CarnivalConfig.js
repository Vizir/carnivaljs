define(function (require) {

  var angular = require('angular');
  var config = angular.module('config', []);

  config.provider('CarnivalConfig', function () {
    
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

  });

  return config;

});