angular.module('carnival.components.listingfieldhasmany', [])
.directive('carnivalListingFieldHasMany', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-has-many/listing-field-has-many.html',
    controller: function ($scope, $stateParams, Configuration, urlParams) {
      var entity = Configuration.getEntity($stateParams.entity);
      $scope.getLabel = function () {
        return 'View ' + $scope.field.label;
      };
      $scope.getUrl = function () {
        return '#/list/' + $scope.field.endpoint + '?filters=' + encodeURIComponent('{"page": 1, "search": { "' + $scope.field.from + '": ' + $scope.item[entity.identifier] + ' }}');
      };
    }
  };
});
