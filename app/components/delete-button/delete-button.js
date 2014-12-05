angular.module('carnival.directives')
.directive('carnivalDeleteBtn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      id: '=',
      entityName: '='
    },
    templateUrl: 'components/delete-button/delete-button.html',
    controller: function ($scope, Configuration, EntityModel, $state) {

      $scope.isDeleting = false;

      $scope.start = function () {
        $scope.isDeleting = true;
      };

      $scope.cancel = function () {
        $scope.isDeleting = false;
      };

      $scope.confirm = function () {
        var entity_params = Configuration.getEntity($scope.entityName),
            entity_model = new EntityModel(entity_params.name, entity_params.options);
        entity_model.delete($scope.id)
        .success(function () {
          $state.reload();
        });
      };
    }
  };
});
