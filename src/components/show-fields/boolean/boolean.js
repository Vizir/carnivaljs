angular.module('carnival.components.showBoolean', [])
.directive('carnivalShowBoolean', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/boolean/boolean.html'  
  };
});
