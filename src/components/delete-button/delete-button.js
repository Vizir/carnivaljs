angular.module('carnival.components.delete-button', [])
.directive('carnivalDeleteButton', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      action: '=',
      itemId: '='
    },
    templateUrl: 'components/delete-button/delete-button.html',
    controller: function ($scope, $filter) {

      $scope.delete = function () {
        var translate = $filter('translate');
        swal({
              title: translate('ARE_YOU_SURE_DELETE'),
              showCancelButton: true,
              confirmButtonText: translate('YES'),
              cancelButtonText: translate('NO'),
              closeOnConfirm: true
          },
          function(){
            $scope.action($scope.itemId);
          }
        );
        $scope.isDeleting = true;
      };

    }
  };
});
