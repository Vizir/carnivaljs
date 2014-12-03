angular.module('carnival.directives')
.directive('carnivalShowForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      datas: '=',
      relations: '='
    },
    templateUrl: 'directives/show-form/show-form.html'
  };
});