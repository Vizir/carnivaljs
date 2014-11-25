define(function (require) {

  var deleteCtrl = ['$scope', '$stateParams', 'Entity', function ($scope, $stateParams, Entity) {

    var entity = Entity.getEntity($stateParams.entity);

    $scope.entityName = entity.label;

  }];

  return deleteCtrl;

});