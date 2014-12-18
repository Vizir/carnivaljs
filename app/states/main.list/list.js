angular.module('carnival')
.controller('ListController', function ($rootScope, $scope, $stateParams, $state, Configuration, Notification, urlParams) {

  var entity = $scope.entity = {},

      pages = $scope.pages = {
        current: parseInt(urlParams.getFilter('page'), 10)
      },

      order = $scope.order = {
        field: urlParams.getFilter('order'),
        dir: urlParams.getFilter('orderDir')
      },

      search = $scope.search = urlParams.getFilter('search');

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

  entity.loadData = function () {
    var offset   = pages.perPage * (urlParams.getFilter('page') - 1);
    var limit    = pages.perPage;
    entity.model.getList(offset, limit, order.field, order.dir, search)
    .success(function (data, status, headers, config) {
      pages.total = 30 / pages.perPage; /* TODO: headers('X-Total-Count') */
      entity.datas = data;
    });
  };

  var init = function () {
    entity.model = Configuration.getEntity($stateParams.entity);
    entity.name = entity.model.name;
    entity.label = entity.model.label;
    entity.identifier = entity.model.identifier;
    entity.fields = [];
    entity.datas = [];
    $scope.buildFieldsForState({state: 'index', entity: entity});

    pages.perPage = entity.model.pagination;

    entity.actions = {
      create: onCreate,
      edit: onEdit,
      show: onShow,
      delete: onDelete
    };

    entity.loadData();

  };

  $rootScope.$on('filterParamsChange', function () {
    console.log('STATE CHANGED!');
    entity.loadData();
  });

  init();

});
