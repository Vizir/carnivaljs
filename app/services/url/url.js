angular.module('carnival')
.service('urlParams', function ($rootScope, $location, $state) {

  this.defaultParams = {
    page: 1
  };

  this.setParam = function (name, value, reload) {
    if (value === '') value = null;
    $location.search(name, value);
    if (reload) this.emitLoadEvent();
  };

  this.getParam = function (name) {
    var value = $location.search()[name];
    return !isNaN(parseInt(value)) && isFinite(value) ? parseInt(value, 10) : value || this.defaultParams[name];
  };

  this.getAllParams = function () {
    return $location.search();
  };

  this.clearParams = function () {
    Object.keys($location.search()).forEach(function (param) {
      $location.search(param, null);
    });
  };

  this.emitLoadEvent = function () {
    $rootScope.$broadcast('paramsChange');
  };

  this.reload = this.emitLoadEvent;

});
