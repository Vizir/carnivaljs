angular.module('carnival.components.pagination-controller', [])
.directive('carnivalPaginationCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {

    },
    templateUrl: 'components/pagination-controller/pagination-controller.html',
    controller: function () {
      console.log('Foooo!');
    }
  };
});
