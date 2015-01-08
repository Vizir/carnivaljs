angular.module('carnival')
.controller('ListController', function ($rootScope, $scope, $stateParams, $state, Configuration, Notification, urlParams, EntityResources) {

  var entity = $scope.entity = {},

  pages = $scope.pages = {
    current: parseInt(urlParams.getParam('page'), 10)
  };

  var onCreate = function () {
    $state.go('main.create', { entity: entity.name });
  };

  var onEdit = function (id) {
    $state.go('main.edit', { entity: entity.name, id: id });
  };

  var onShow = function (id) {
    $state.go('main.show', { entity: entity.name, id: id });
  };

  var onDelete = function (id) {
    entity.model.delete(id)
    .success(function () {
      new Notification('Item deleted with success!', 'warning');
      $state.reload();
    })
    .error(function (data) {
      new Notification(data, 'danger');
    });
  };



  var init = function () {

    entity = EntityResources.prepareForListState($stateParams.entity);
    entity.loadData = function () {
      var offset   = pages.perPage * (urlParams.getParam('page') - 1);
      var limit    = pages.perPage;
      entity.model.getList(offset, limit, urlParams.getParam('order'), urlParams.getParam('orderDir'), urlParams.getParam('search'))
      .success(function (data, status, headers, config) {
        pages.total = headers('X-Total-Count') / pages.perPage;
        entity.datas = data;
      });
    };
    $scope.entity = entity;
    pages.perPage = entity.model.pagination;

    entity.actions = {
      create: onCreate,
      edit: onEdit,
      show: onShow,
      delete: onDelete
    };

    entity.loadData();

  };

  $rootScope.$on('paramsChange', function () {
    entity.loadData();
  });

  init();

});
