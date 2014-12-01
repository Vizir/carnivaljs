angular.module('shared-data', [])

.factory('SharedData', function () {
  return {
    notifications: [],
    loading: 0
  };
});