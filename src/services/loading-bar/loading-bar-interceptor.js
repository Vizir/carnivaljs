angular.module('carnival')
.config(function ($httpProvider) {

  $httpProvider.interceptors.push(function ($q, $cacheFactory, $timeout, $rootScope, loadingBar) {

    var totalReqs = 0;
    var completedReqs = 0;
    var startTimeout;

    function setComplete() {
      $timeout.cancel(startTimeout);
      loadingBar.complete();
      completedReqs = 0;
      totalReqs = 0;
    }

    function isCached(config) {
      var cache;
      var defaultCache = $cacheFactory.get('$http');
      var defaults = $httpProvider.defaults;
      if ((config.cache || defaults.cache) && config.cache !== false && (config.method === 'GET' || config.method === 'JSONP')) {
        cache = angular.isObject(config.cache) ? config.cache :
        angular.isObject(defaults.cache) ? defaults.cache : defaultCache;
      }
      var cached = cache !== undefined ? cache.get(config.url) !== undefined : false;

      if (config.cached !== undefined && cached !== config.cached) {
        return config.cached;
      }
      config.cached = cached;
      return cached;
    }

    return {

      'request': function (config) {
        if (!config.ignoreLoadingBar && !isCached(config)) {
          $rootScope.$broadcast('loadingBar.loading', {url: config.url});
          if (totalReqs === 0) {
            startTimeout = $timeout(function() { loadingBar.start(); }, loadingBar.latency);
          }
          totalReqs++;
          loadingBar.set(completedReqs / totalReqs);
        }
        return config;
      },

      'response': function(response) {
        if (!response.config.ignoreLoadingBar && !isCached(response.config)) {
          completedReqs++;
          $rootScope.$broadcast('loadingBar.loaded', { url: response.config.url, result: response });
          if (completedReqs >= totalReqs) {
            setComplete();
          } else {
            loadingBar.set(completedReqs / totalReqs);
          }
        }
        return response;
      },

      'responseError': function(rejection) {
        if (!rejection.config.ignoreLoadingBar && !isCached(rejection.config)) {
          completedReqs++;
          $rootScope.$broadcast('loadingBar.loaded', { url: rejection.config.url, result: rejection });
          if (completedReqs >= totalReqs) {
            setComplete();
          } else {
            loadingBar.set(completedReqs / totalReqs);
          }
        }
        return $q.reject(rejection);
      }
    };
  });

});
