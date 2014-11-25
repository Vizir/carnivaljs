define(function (require) {

  var angular = require('angular');

  var createCtrl = ['$scope',
                    '$stateParams',
                    '$state',
                    'Api',
                    'Entity',
                    '$http',
  function ($scope, $stateParams, $state, Api, Entity, $http) {
    
    var entity = Entity.getEntity($stateParams.entity);
    var fields = entity.getFields();
    
    $scope.entityName = entity.name;
    $scope.entityLabel = entity.label;
    $scope.entityFields = [];
    $scope.form = {};

    fields.forEach(function (field) {
      if (entity.checkFieldView(field.name, 'create')) {
        $scope.entityFields.push(field);
      }
    });

    $scope.save = function () {
      var values = angular.copy($scope.form);
      $http.post(Api.getBaseApiUrl() + '/' + entity.name, values)
      .success(function (data, status, headers, config) {
        $state.reload();
      });
    };

  }];

  return createCtrl;

});