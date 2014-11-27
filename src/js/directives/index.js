define(function (require) {

  var angular = require('angular');
  var directives = angular.module('directives', []);
  
  directives.directive('notification', require('directives/notification'));

  return directives;

});