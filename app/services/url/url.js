angular.module('carnival')
.service('urlParams', function ($rootScope, $location, $state, $stateParams) {

  var defaultValues = {
    page: 1
  };

  var decodeUrl = function () {
    if (!$stateParams.filters) return defaultValues;
    return JSON.parse(decodeURIComponent($stateParams.filters));
  };

  var encodeUrl = function (obj) {
    obj = (typeof obj === 'string') ? obj : JSON.stringify(obj);
    $stateParams.filters = encodeURIComponent(obj);
  };

  this.setFilter = function (name, value, reload) {
    var filters = decodeUrl();
    filters[name] = value;
    encodeUrl(filters);
    if (reload) this.reload();
  };

  this.getFilter = function (name) {
    var filters = decodeUrl();
    return filters[name];
  };

  this.getAllFilters = function () {
    return decodeUrl();
  };

  this.clearFilters = function () {
    $stateParams.filters = null;
  };

  this.reload = function () {
    $location.search('filters', $stateParams.filters);
    $rootScope.$broadcast('filterParamsChange');
  };

});
