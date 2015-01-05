angular.module('carnival')
.controller('ListController', function ($rootScope, $scope, $stateParams, $state, Configuration, Notification, urlParams, EntityResources) {

  var entity = $scope.entity = {},

      pages = $scope.pages = {
        current: parseInt(urlParams.getFilter('page'), 10)
      },

      order = $scope.order = {
        field: urlParams.getFilter('order'),
        dir: urlParams.getFilter('orderDir')
      },

      search = $scope.search = urlParams.getFilter('search');



  var init = function () {

    $scope.entity = entity = EntityResources.prepareForListState($stateParams.entity);

    pages.perPage = entity.model.pagination;

    entity.loadData = function () {
      var offset   = pages.perPage * (urlParams.getFilter('page') - 1);
      var limit    = pages.perPage;
      entity.model.getList(offset, limit, order.field, order.dir, search)
      .success(function (data, status, headers, config) {
        pages.total = 30 / pages.perPage; /* TODO: headers('X-Total-Count') */
        entity.datas = data;
      });
    };


    entity.loadData();

  };

  $rootScope.$on('filterParamsChange', function () {
    console.log('STATE CHANGED!');
    entity.loadData();
  });

  init();

});
