define(function (require) {

  var editCtrl = ['$scope',
                  '$stateParams',
                  '$state',
                  'Api',
                  'Entity',
                  '$http',
  function ($scope, $stateParams, $state, Api, Entity, $http) {

    var entity = Entity.getEntity($stateParams.entity);
    var fields = entity.getFields();
    var id = $stateParams.id;
    
    $scope.entityName = entity.name;
    $scope.entityLabel = entity.label;
    $scope.entityFields = [];
    
    fields.forEach(function (field) {
      if (entity.checkFieldView(field.name, 'edit')) {
        $scope.entityFields.push(field);
      }
    });

    $http.get(Api.getBaseApiUrl() + '/' + entity.name + '/' + id)
    .success(function (data, status, headers, config) {
      $scope.form = data;
    });

    $scope.save = function () {
      var values = angular.copy($scope.form);
      $http.put(Api.getBaseApiUrl() + '/' + entity.name + '/' + id, values)
      .success(function (data, status, headers, config) {
        $state.reload();
      });
    };

  }];

  return editCtrl;

});