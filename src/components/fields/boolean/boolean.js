angular.module('carnival.components.fields.boolean', [])
.directive('carnivalBooleanField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/fields/boolean/boolean.html',
    controller: function($scope){
      if($scope.data === undefined)
        $scope.data = false;
    }
  };
});
