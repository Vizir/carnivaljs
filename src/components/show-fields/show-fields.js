angular.module('carnival.components.show-fields', [])
.directive('carnivalShowFields', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'components/show-fields/show-fields.html'
  };
});
