angular.module('carnival')
.controller('ListController', function ($rootScope, $scope, $stateParams, $state, Configuration, Notification, urlParams, EntityResources, $filter) {

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
      var message = $filter('translate')('DELETED_SUCCESS_MESSAGE');
      new Notification(message, 'warning');
      $state.reload();
    })
    .error(function (data) {
      new Notification(data, 'danger');
    });
  };

  var getSearchParams = function () {
    var searchParams = {};
    for (var i = 0, x = entity.fields.length; i < x; i += 1) {
      var fieldName = entity.fields[i].name;
      if(entity.fields[i].type === 'belongsTo')
        fieldName = entity.fields[i].foreignKey;
      searchParams[fieldName] = urlParams.getParam('search.' + fieldName);

    }
    return (Object.keys(searchParams).length === 0) ? false : searchParams;
  };

  var init = function () {

    entity = EntityResources.prepareForListState($stateParams.entity);
    entity.loadData = function () {
      var offset   = pages.perPage * (urlParams.getParam('page') - 1);
      var limit    = pages.perPage;
      var order    = urlParams.getParam('order');
      var orderDir = urlParams.getParam('orderDir');
      if (!order && !orderDir && entity.defaultSort) {
        order = entity.defaultSort.field;
        orderDir = entity.defaultSort.dir;
      }
      entity.model.getList(offset, limit, order, orderDir, getSearchParams())
      .success(function (data, status, headers, config) {
        pages.total = Math.ceil(headers('X-Total-Count') / pages.perPage);
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
