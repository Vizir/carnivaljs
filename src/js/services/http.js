angular.module('http', [])

.factory('http', ['$http', '$q', 'Api', 'SharedData', function ($http, $q, Api, SharedData) {

  var baseApiUrl = Api.getBaseApiUrl();
  
  return {

    get: function (entity) {
      return $q(function (resolve, reject) {
        SharedData.loading++;
        $http.get(baseApiUrl + '/' + entity.name)
        .success(function (data, status, headers, config) {
          SharedData.loading--;
          resolve(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          SharedData.loading--;
          reject(data, status, headers, config);
        });
      });
    },

    getOne: function (entity, id) {
      return $q(function (resolve, reject) {
        SharedData.loading++;
        $http.get(baseApiUrl + '/' + entity.name + '/' + id)
        .success(function (data, status, headers, config) {
          SharedData.loading--;
          resolve(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          SharedData.loading--;
          reject(data, status, headers, config);
        });
      });
    },

    post: function (entity, data) {
      return $q(function (resolve, reject) {
        SharedData.loading++;
        $http.post(baseApiUrl + '/' + entity.name, data)
        .success(function (data, status, headers, config) {
          SharedData.loading--;
          resolve(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          SharedData.loading--;
          SharedData.notifications.push({ message: data.error.message, type: 'error' });
        });
      });
    },

    put: function (entity, id, data) {
      return $q(function (resolve, reject) {
        SharedData.loading++;
        $http.put(baseApiUrl + '/' + entity.name + '/' + id, data)
        .success(function (data, status, headers, config) {
          SharedData.loading--;
          resolve(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          SharedData.loading--;
          reject(data, status, headers, config);
        });
      });
    },

    destroy: function (entity, id) {
      return $q(function (resolve, reject) {
        SharedData.loading++;
        $http.delete(Api.getBaseApiUrl() + '/' + entity.name + '/' + id)
        .success(function (data, status, headers, config) {
          SharedData.loading--;
          resolve(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          SharedData.loading--;
          reject(data, status, headers, config);
        });
      });
    },

    getRel: function (entity, id, rel) {
      return $q(function (resolve, reject) {
        SharedData.loading++;
        $http.get(Api.getBaseApiUrl() + '/' + entity.name + '/' + id + '/' + rel)
        .success(function (data, status, headers, config) {
          SharedData.loading--;
          resolve(data, status, headers, config);
        })
        .error(function (data, status, headers, config) {
          SharedData.loading--;
          reject(data, status, headers, config);
        });
      });
    }
    
  };
}]);