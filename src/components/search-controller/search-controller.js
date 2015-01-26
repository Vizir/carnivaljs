angular.module('carnival.components.search-controller', [])
.directive('carnivalSearchCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      relatedResources: '='
    },
    templateUrl: 'components/search-controller/search-controller.html',
    controller: function ($scope, urlParams) {

      var getSearchParams = function () {
        $scope.searchParams = {};
        for (var i = 0, x = $scope.fields.length; i < x; i += 1) {
          var fieldName = $scope.fields[i].name;
          if($scope.fields[i].type === 'belongsTo')
            fieldName = $scope.fields[i].foreignKey;
          $scope.searchParams[fieldName] = urlParams.getParam('search.' + fieldName);
        }
      };

      $scope.submit = function () {
        var searchParamsKeys = Object.keys($scope.searchParams);
        for (var i = 0, x = searchParamsKeys.length; i < x; i += 1) {
          urlParams.setParam('search.' + searchParamsKeys[i], $scope.searchParams[searchParamsKeys[i]]);
        }
        urlParams.emitLoadEvent();
      };

      getSearchParams();

    }
  };
});
