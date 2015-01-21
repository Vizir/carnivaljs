/* CARNIVAL.JS */
(function () {
"use strict";
angular.module('carnival', [
  'carnival.templates',
  'ui.router',
  'carnival.components',
  'pascalprecht.translate',
  'textAngular'
])
.config(["$stateProvider", "$urlRouterProvider", "$translateProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'states/main/main.html',
      controller: 'MainController'
    })
    .state('main.list', {
      url: 'list/:entity',
      templateUrl: 'states/main.list/list.html',
      controller: 'ListController'
    })
    .state('main.show', {
      url: 'show/:entity/:id',
      templateUrl: 'states/main.show/show.html',
      controller: 'ShowController'
    })
    .state('main.create', {
      url: 'create/:entity',
      templateUrl: 'states/main.create/create.html',
      controller: 'CreateController'
    })
    .state('main.edit', {
      url: 'edit/:entity/:id',
      templateUrl: 'states/main.edit/edit.html',
      controller: 'EditController'
    });

}])
.run(["Configuration", "Entity", function (Configuration, Entity){
  // Model entities
  for (var i = 0, entities = Configuration.entities, x = entities.length; i < x; i++) {
    entities[i] = new Entity(entities[i].name, entities[i].options);
  }
}]);

angular.module('carnival.components.button', [])
.directive('carnivalButton', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '@',
      style: '@',
      size: '@'
    },
    templateUrl: 'components/button/button.html'
  };
});

angular.module('carnival.components', [
  'carnival.components.button',
  'carnival.components.form',
  'carnival.components.delete-button',
  'carnival.components.listing',
  'carnival.components.listingfieldbelongsto',
  'carnival.components.listingfieldhasmany',
  'carnival.components.listingfield',
  'carnival.components.navbar',
  'carnival.components.fields',
  'carnival.components.order-controller',
  'carnival.components.pagination-controller',
  'carnival.components.search-controller',
  'carnival.components.notification',
  'carnival.components.quickfilter-controller',
  'carnival.components.listingFieldFile',
  'carnival.components.uploader',
  'carnival.components.gallery'
]);

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
    controller: ["$scope", function ($scope) {

      $scope.isDeleting = false;

      $scope.start = function () {
        $scope.isDeleting = true;
      };

      $scope.cancel = function () {
        $scope.isDeleting = false;
      };

      $scope.confirm = function () {
        $scope.action($scope.itemId);
      };
    }]
  };
});

angular.module('carnival.components.fields.belongsTo', [])
.directive('carnivalBelongsToField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      entity: '=',
      nestedFormIndex: '=',
      relatedResources: '=',
      editable: '='
    },
    templateUrl: 'components/fields/belongs-to/belongs-to.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    },
    controller: ["$rootScope", "$scope", "utils", function ($rootScope, $scope, utils) {
      $scope.utils = utils;

      $scope.canShowNestedForm = function(field){
        if(!$scope.entity.nestedForms[field.endpoint])
          return false;
        
        if(!$scope.entity.datas[field.identifier])
          return false;
        return true;
      };

      $scope.open = function(index){
        $scope.entity.nestedForms[$scope.field.endpoint].opened = true;
      };

    }]
  };
});

angular.module('carnival.components.fields.boolean', [])
.directive('carnivalBooleanField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/boolean/boolean.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});

angular.module('carnival.components.fields', [
  'carnival.components.fields.number',
  'carnival.components.fields.select',
  'carnival.components.fields.belongsTo',
  'carnival.components.fields.hasMany',
  'carnival.components.fields.string',
  'carnival.components.fields.text',
  'carnival.components.fields.wysiwyg',
  'carnival.components.fields.boolean',
  'carnival.components.fields.file'
]);

angular.module('carnival.components.fields.file', [])
.directive('carnivalFileField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '=',
      editable: '='
    },
    templateUrl: 'components/fields/file/file.html',
    controller: ["$scope", "$http", "Configuration", function ($scope, $http, Configuration) {

      $scope.checkIfIsImage = function (file) {
        return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file);
      };

      $scope.checkIfHasUploader = function () {
        return typeof $scope.field.uploader !== 'undefined';
      };

      $scope.checkIfHasGallery = function () {
        return typeof $scope.field.gallery !== 'undefined';
      };

    }]
  };
});

angular.module('carnival.components.fields.hasMany', [])
.directive('carnivalHasManyField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      state: '@state',
      entity: '=',
      nestedFormIndex: '=',
      relatedResources: '=',
      editable: '='
    },
    templateUrl: 'components/fields/has-many/has-many.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    },
    controller: ["$rootScope", "$scope", "utils", "Configuration", function ($rootScope, $scope, utils, Configuration) {
      $scope.utils = utils;

      $scope.open = function(index){
        $scope.entity.nestedForms[$scope.field.endpoint].opened = true;
      };

      $scope.canOpenNestedForm = function(){
        if(!$scope.entity.nestedForms[$scope.field.name])
          return false;

        if($scope.state === 'create')
          return false;

        return true;
      };

      $scope.canShow = function(){
        var fieldEntity = Configuration.getEntity($scope.field.entityName);
        var f = fieldEntity.getFieldByEntityName($scope.entity.name);
        if(f === null)
          return true;

        if(f.type === 'belongsTo' && f.required)
          return false;

        return true;
      };

      var getItemIndex = function(id, items){
        for(var i = 0; i < items.length; i++){
          if(items[i].id === id)
            return i;
        }
        return -1;
      };

      var getSelectedItem = function(){
        var items = $scope.relatedResources[$scope.field.name];
        var index = getItemIndex($scope.selectedHasMany, items);
        if(index >= 0)
          return items[index];
      };

      $scope.addHasManyOption = function(){
        var selectedItem = getSelectedItem();
        if(!$scope.datas[$scope.field.name])
          $scope.datas[$scope.field.name] = [];
        if(selectedItem){
          $scope.datas[$scope.field.name].push(selectedItem);
        }
      };

      var deleteIfNeeded = function(id){
        if($scope.field.views[$scope.state].enableDelete){
          var fieldEntity = Configuration.getEntity($scope.field.entityName);
          fieldEntity.delete(id)
          .success(function () {
            new Notification('Item deleted with success!', 'warning');
            $state.reload();
          })
          .error(function (data) {
            new Notification(data, 'danger');
          });
        }
      };

      $scope.remove = function(id){
        var items = $scope.datas[$scope.field.name];
        var index = getItemIndex(id, items);
        if(index < 0)
          return;
        items.splice(index, 1);

        deleteIfNeeded(id);
      };
    }]
  };
});

angular.module('carnival.components.fields.number', [])
.directive('carnivalNumberField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/number/number.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});

angular.module('carnival.components.fields.select', [])
.directive('carnivalSelectField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      items: '=',
      field: '=',
      identifier: '=',
      editable: '='
    },
    templateUrl: 'components/fields/select/select.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    },
    controller: ["$rootScope", "$scope", "utils", function ($rootScope, $scope, utils) {
      $scope.utils = utils;
    }]
  };
});

angular.module('carnival.components.fields.string', [])
.directive('carnivalStringField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/string/string.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});

angular.module('carnival.components.fields.text', [])
.directive('carnivalTextField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/text/text.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});

angular.module('carnival.components.fields.wysiwyg', [])
.directive('carnivalWysiwygField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '=',
      editable: '='
    },
    templateUrl: 'components/fields/wysiwyg/wysiwyg.html',
    link: function (scope, element, attrs) {
      if (!scope.editable) {
        element.attr('disabled', 'true');
      }
    }
  };
});

angular.module('carnival.components.form', [])
.directive('carnivalForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      fields: '=',
      action: '=',
      state: '@state',
      type: '@',
      datas: '=',
      relatedResources: '=',
      editable: '='
    },
    templateUrl: 'components/form/form.html',
    controller: ["$rootScope", "$scope", "utils", function ($rootScope, $scope, utils) {
      $scope.utils = utils;
      $scope.canShow = function(field){
        if(field.type != 'hasMany' && field.type != 'belongsTo')
          return true;
        
        if(!$scope.entity.parentEntity)
          return true;
        return false;
      };

      var closeAllNestedForms = function(){
        for(var form in $scope.entity.parentEntity.nestedForms){
          $scope.entity.parentEntity.nestedForms[form].opened = false;
        }
      };

      $scope.buttonAction = function(){
        $scope.action.click();
        if($scope.type === 'nested')
          closeAllNestedForms();
      };
    }]
  };
});

angular.module('carnival.components.gallery', [])
.directive('carnivalGallery', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      gallery: '=',
      fileUrl: '='
    },
    controller: ["$scope", function ($scope) {
      if (!window.CARNIVAL) window.CARNIVAL = {};
      if (!window.CARNIVAL.gallery) window.CARNIVAL.gallery = {};
      window.CARNIVAL.gallery.sendUrl = function (url) {
        $scope.fileUrl = url;
      };
      $scope.open = function () {
        window.open($scope.gallery.url, 'WINDOW_GALLERY', 'dialog');
      };
    }],
    templateUrl: 'components/gallery/gallery.html'
  };
});

angular.module('carnival.components.listingfieldbelongsto', [])
.directive('carnivalListingFieldBelongsTo', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-belongs-to/listing-field-belongs-to.html',
    controller: ["$scope", "$stateParams", "Configuration", function($scope, $stateParams, Configuration){
      var entityModel = Configuration.getEntity($stateParams.entity);

      $scope.getUrl = function(){
        var fieldUrl = $scope.item[$scope.field.name + 'Url'];
        if(!fieldUrl)
          fieldUrl = '#/show/' + $scope.field.endpoint + '/' + $scope.item[$scope.field.name].id;
        return fieldUrl;
      };

      $scope.getLabel = function(){
        return $scope.item[$scope.field.name][$scope.field.field];
      };
    }]
  };
});

angular.module('carnival.components.listingFieldFile', [])
.directive('carnivalListingFieldFile', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-file/listing-field-file.html',
    controller: ["$scope", function ($scope) {
      $scope.checkIfIsImage = function (file) {
        return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file);
      };
    }]
  };
});

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
    controller: ["$scope", "$stateParams", "Configuration", "urlParams", function ($scope, $stateParams, Configuration, urlParams) {
      var entity = Configuration.getEntity($stateParams.entity);
      
      var getRelationField = function(fields){
        for(var i = 0; i < fields.length; i++){
          var f = fields[i];
          if(f.type !== 'belongsTo' && f.type !== 'hasMany')
            continue;

          if(f.entityName === entity.name)
            return f;
        }
        return null;
      };

      $scope.getLabel = function () {
        return 'View ' + $scope.field.label;
      };
      $scope.getUrl = function () {
        var hasManyEntity = Configuration.getEntity($scope.field.entityName);
        var hasManyEntityField = getRelationField(hasManyEntity.fields);

        return '#/list/' + $scope.field.endpoint + '?page=1&search.' + hasManyEntityField.foreignKey + '=' + $scope.item[entity.identifier];
      };
    }]
  };
});

angular.module('carnival.components.listingfield', [])
.directive('carnivalListingField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field/listing-field.html'    
  };
});

angular.module('carnival.components.listing', [])
.directive('carnivalListing', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      datas: '=',
      actions: '=',
      identifier: '=',
      entityName: '='
    },
    templateUrl: 'components/listing/listing.html'
  };
});

angular.module('carnival.components.navbar', [])
.directive('carnivalNavbar', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      appName: '=',
      menuItems: '='
    },
    templateUrl: 'components/navbar/navbar.html',
    controller: ["$scope", "$stateParams", "urlParams", "$location", function ($scope, $stateParams, urlParams, $location) {
    
      var urlPrefix = "#";
      if($location.$$html5){
        urlPrefix = "";
      }

      $scope.buildUrl = function (link) {
        if (link.type === 'entity') return urlPrefix + '/list/' + link.url;
        if (link.type === 'url')    return link.url;
        return '#';
      };

      $scope.checkSelEntity = function (index) {
        if ($scope.menuItems[index].link.type === 'entity' &&
            $scope.menuItems[index].link.url === $stateParams.entity) {
          return true;
        } else {
          return false;
        }
      };
    }]
  };
});

angular.module('carnival.components.notification', [])
.directive('carnivalNotification', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    templateUrl: 'components/notification/notification.html',
    controller: ["$scope", "notificationFactory", function ($scope, notificationFactory) {
      $scope.notifications = notificationFactory;
    }]
  };
});

angular.module('carnival.components.order-controller', [])
.directive('carnivalOrderCtrl', function () {
  return {
    restrict: 'E',
    replate: true,
    scope: {
      field: '='
    },
    templateUrl: 'components/order-controller/order-controller.html',
    controller: ["$scope", "urlParams", function ($scope, urlParams) {
      $scope.toggleOrder = function () {
        var orderDirValue = (urlParams.getParam('order') !== $scope.field) ? 'asc' :
                            (urlParams.getParam('orderDir') === 'asc' && urlParams.getParam('order') === $scope.field) ? 'desc' : 'asc';
        urlParams.setParam('order', $scope.field);
        urlParams.setParam('orderDir', orderDirValue);
        urlParams.reload();
      };
      $scope.checkDirAsc = function () {
        if (urlParams.getParam('order') === $scope.field && urlParams.getParam('orderDir') === 'asc') return true;
        return false;
      };
    }]
  };
});

angular.module('carnival.components.pagination-controller', [])
.directive('carnivalPaginationCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      currentPage: '=',
      totalPages: '='
    },
    templateUrl: 'components/pagination-controller/pagination-controller.html',
    controller: ["$scope", "$rootScope", "urlParams", function ($scope, $rootScope, urlParams) {
      $scope.jumpTo = function (page) {
        urlParams.setParam('page', page, true);
      };
      $scope.nextPage = function () {
        if ($scope.currentPage === $scope.totalPages) return;
        urlParams.setParam('page', $scope.currentPage + 1, true);
      };
      $scope.prevPage = function () {
        if ($scope.currentPage === 1) return;
        urlParams.setParam('page', $scope.currentPage - 1, true);
      };
      $rootScope.$on('paramsChange', function () {
        $scope.currentPage = parseInt(urlParams.getParam('page'), 10);
      });
    }]
  };
});

angular.module('carnival.components.quickfilter-controller', [])
.directive('carnivalQuickFilter', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      filters: '='
    },
    templateUrl: 'components/quickfilter-controller/quickfilter-controller.html',
    controller: ["$scope", "urlParams", function ($scope, urlParams) {

      $scope.isSelected = function (field, value) {
        return value === urlParams.getParam('search.' + field);
      };

      $scope.setFilter = function (field, value) {
        urlParams.setParam('search.' + field, value, true);
      };

    }]
  };
});

angular.module('carnival.components.search-controller', [])
.directive('carnivalSearchCtrl', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fields: '=',
      relatedResources: '='
    },
    templateUrl: 'components/search-controller/search-controller.html',
    controller: ["$scope", "urlParams", function ($scope, urlParams) {

      var getSearchParams = function () {
        $scope.searchParams = {};
        for (var i = 0, x = $scope.fields.length; i < x; i += 1) {
          var fieldName = $scope.fields[i].name;
          if($scope.fields[i].type === 'belongsTo')
            fieldName = $scope.fields[i].foreignKey;
          $scope.searchParams[fieldName] = urlParams.getParam('search.' + fieldName);
        }
      };

      $scope.submit = function () {
        var searchParamsKeys = Object.keys($scope.searchParams);
        for (var i = 0, x = searchParamsKeys.length; i < x; i += 1) {
          urlParams.setParam('search.' + searchParamsKeys[i], $scope.searchParams[searchParamsKeys[i]]);
        }
        urlParams.emitLoadEvent();
      };

      getSearchParams();

    }]
  };
});

angular.module('carnival.components.uploader', [])
.directive('carnivalUploader', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      uploader: '=',
      fileUrl: '='
    },
    templateUrl: 'components/uploader/uploader.html',
    controller: ["$scope", "$http", "Uploader", "Notification", "Configuration", function ($scope, $http, Uploader, Notification, Configuration) {

      var getRequestUrl = function () {
        if ($scope.uploader.endpoint && $scope.uploader.endpointUrl) {
          throw 'Set only one type of endpoint for the uploader';
        }
        if ($scope.uploader.endpoint) {
          return Configuration.getBaseApiUrl() + '/' + $scope.uploader.endpoint;
        }
        return $scope.uploader.endpointUrl;
      };

      $scope.upload = function () {

        Uploader.upload(getRequestUrl(), $scope.files[0])
        .success(function (data) {
          new Notification('File uploaded with success', 'success');
          $scope.fileUrl = $scope.uploader.getUrl(data);
        })
        .error(function (error) {
          new Notification(error, 'warning');
        });

      };
    }]
  };
})

.directive('fileInput', ["$parse", function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      element.bind('change', function () {
        $parse(attributes.fileInput)
        .assign(scope, element[0].files);
        scope.$apply();
      });
    }
  };
}]);

angular.module('carnival').provider('Configuration', function() {

  var appName = null;
  var baseApiUrl = null;
  var validateEntities = false;
  var entities = [];
  var navbar = [];

  return {
    setBaseApiUrl: function (url) {
      url.replace(/\/$/, '');
      baseApiUrl = url;
    },

    setAppName: function (name) {
      appName = name;
    },

    validateEntities: function (validate) {
      if (validate) validateEntities = true;
    },

    setEntities: function(entities) {
      entities = entities;
    },

    addEntity: function (entityName, entityOptions) {
      entities.push({ name: entityName, options: entityOptions });
    },

    addNavbarItem: function (options) {
      navbar.push(options);
    },

    $get: function () {
      return {

        entities: entities,

        validateEntities: validateEntities,

        getBaseApiUrl: function () {
          return baseApiUrl;
        },

        getAppName: function () {
          return appName;
        },

        getEntity: function (entityName) {
          for (var i = 0, x = entities.length; i < x; i += 1) {
            if (entities[i].name === entityName) {
              return entities[i];
            }
          }
          return 'Entity not found!';
        },

        getEntities: function () {
          return entities;
        },

        getNavbarItems: function () {
          return navbar;
        }

      };
    }

  };

});

angular.module('carnival')
.factory('Entity', ["EntityValidation", "$http", "Configuration", "RequestBuilder", "FieldBuilder", function (EntityValidation, $http, Configuration, RequestBuilder, FieldBuilder) {

  var buildViews = function (views) {
    var _views = {};
    Object.keys(views).forEach(function (view_name) {
      _views[view_name] = {
        enable:     views[view_name].enable,
        searchable: views[view_name].searchable || true,
        nested:     views[view_name].nested || false,
        sortable:   views[view_name].sortable   || true
      };
    });
    return _views;
  };

  var buildFields = function (fields, that) {
    var _fields = [];

    Object.keys(fields).forEach(function (field_name) {
      var field = FieldBuilder.build(field_name, fields[field_name]);
      _fields.push(field);
    });

    that.fields = _fields;
  };

  function Entity (name, options) {
    if (Configuration.validateEntities) EntityValidation(name, options);
    this.name = name;
    this.endpoint       = options.endpoint || this.name;
    this.label          = options.label || this.name;
    this.identifier     = options.identifier;
    this.extraReqParams = options.extraReqParams || {};
    this.quickFilters   = options.quickFilters   || null;
    this.pagination     = options.pagination     || null;
    this.fields = [];
    buildFields(options.fields, this);
  }

  Entity.prototype.checkFieldView = function (name, view) {
    for (var i = 0, x = this.fields.length; i < x; i += 1) {
      if (this.fields[i].name === name) {
        return this.fields[i].views[view] && this.fields[i].views[view].enable;
      }
    }
    return false;
  };

  Entity.prototype.getFieldByEntityName = function (entityName){
    for(var i = 0; i < this.fields.length; i++){
      if(this.fields[i].entityName === entityName)
        return this.fields[i];
    }
  };

  // $http services

  Entity.prototype.getList = function (offset, limit, order, orderDir, search) {
    var extraParams = this.extraReqParams.list || {};
    var requestParams = RequestBuilder.buildForGetList({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      offset: offset,
      entity: this,
      limit: limit,
      order: order,
      orderDir: orderDir,
      search: search,
      endpoint: this.endpoint
    });

    return this.request(requestParams);
  };

  Entity.prototype.getOne = function (id) {
    var extraParams = this.extraReqParams.show || {};
    var requestParams = RequestBuilder.buildForGetOne({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      id: id,
      endpoint: this.endpoint
    });
    return this.request(requestParams);
  };

  Entity.prototype.delete = function (id) {
    var extraParams = this.extraReqParams.delete || {};
    var requestParams = RequestBuilder.buildForDelete({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      id: id,
      endpoint: this.endpoint
    });
    return this.request(requestParams);
  };

  Entity.prototype.create = function (data) {
    var extraParams = this.extraReqParams.create || {};
    var requestParams = RequestBuilder.buildForCreate({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      entity: this,
      entityData: data,
      endpoint: this.endpoint
    });
    return this.request(requestParams);
  };

  Entity.prototype.update = function (id, data) {
    var extraParams = this.extraReqParams.update || {};
    var requestParams = RequestBuilder.buildForUpdate({
      baseUrl: Configuration.getBaseApiUrl(),
      extraParams: extraParams,
      id: id,
      entity: this,
      entityData: data,
      endpoint: this.endpoint
    });
    return this.request(requestParams);
  };

  Entity.prototype.request = function(requestParams){
    return $http(requestParams);
  };

  return Entity;

}]);

angular.module('carnival')
.factory('EntityValidation', function () {

  var Validation = function (name, options) {
    // Check if name is empty
    if (!name)
      throw 'You must set a name for your entity';
    // Check if identifier is empty
    if (!options.identifier)
      throw 'You must set an identifier for the entity ' + name;
    // Check if fields is empty
    if (!options.fields)
      throw 'You must set the fields for the entity ' + this.name;
  };

  return Validation;

});

angular.module('carnival')
.service('ActionFactory', ["Notification", "$state", "ParametersParser", "EntityUpdater", function (Notification, $state, ParametersParser, EntityUpdater) {

  this.buildCreateFunction = function(entity, hasNestedForm, isToNestedForm){
    return function () {
      entity.model.create(ParametersParser.parse(entity.datas, entity))
      .success(function (data, status, headers, config) {
        if(isToNestedForm){
          var parentEntity = entity.parentEntity;
          var fieldToUpdate = parentEntity.model.getFieldByEntityName(entity.name);
          EntityUpdater.updateEntity(parentEntity, fieldToUpdate, data);
        }
        else{
          new Notification('Item created with success!', 'success');
          if(hasNestedForm)
            $state.go('main.edit', { entity: entity.model.name, id: data.id });
          else
            $state.go('main.list', { entity: entity.model.name });
        }
      })
      .error(function (data) {
        new Notification(data, 'danger');
      });
    };
  };

  this.buildEditFunction = function(entity){
    return function () {
      entity.model.update(entity.id, ParametersParser.parse(entity.datas, entity))
      .success(function () {
        new Notification('Modifications saved with success!', 'success');
        $state.go('main.show', { entity: entity.model.name, id: entity.id });
      })
      .error(function (data) {
        new Notification(data, 'danger');
      });
    };
  };

  this.buildShowFunction = function(entity){
    return function () {
      $state.go('main.edit', { entity: entity.model.name, id:entity.id });
    };
  };


  this.buildListFunction = function(entity){
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

    return {
      create: onCreate,
      edit: onEdit,
      show: onShow,
      delete: onDelete
    };
  };

  this.buildAction = function(entity, stateName, isToNestedForm){
    switch (stateName) {
      case 'create':
        return {
          name: 'action',
          value: {
            label: "Save",
            click: this.buildCreateFunction(entity, Object.keys(entity.nestedForms).length > 0, isToNestedForm)
          }
        };

      case 'edit':
        return {
          name: 'action',
          value: {
            label: "Save",
            click: this.buildEditFunction(entity)
          }
        };

      case 'show':
        return {
          name: 'action',
          value: {
            label: "Edit",
            click: this.buildShowFunction(entity)
          }
        };

      case 'index':
        return {
          name: 'actions',
          value: this.buildListFunction(entity)
        };
      default:
        return {};
    }
  };
}]);

angular.module('carnival')
.service('FieldBuilder', function () {

  var buildViews = function (views) {
    var _views = {};
    Object.keys(views).forEach(function (view_name) {
      _views[view_name] = {
        enable:    views[view_name].enable,
        searchable: views[view_name].searchable || true,
        enableDelete: views[view_name].enableDelete || false,
        nested: views[view_name].nested || false,
        sortable:   views[view_name].sortable   || true
      };
    });
    return _views;
  };

  var capitalizeFirstLetter = function(word){
    return word.charAt(0).toUpperCase() +
      word.substring(1);
  };

  var resolveForeignKey = function(field){
    if(field.type !== 'belongsTo' && field.type !== 'hasMany')
      return;

    if(field.foreignKey)
      return field.foreignKey;
    if(!field.identifier)//TODO Is impossible to discover tthe foreignKey name without identifier
      return field.name;
    return field.name + capitalizeFirstLetter(field.identifier);
  };

  this.build = function(field_name, fieldParams){
    var field = {
      name:       field_name,
      label:      fieldParams.label,
      foreignKey: fieldParams.foreignKey,
      endpoint:   fieldParams.endpoint || field_name,
      required:   fieldParams.required,
      field:      fieldParams.field,
      identifier: fieldParams.identifier || 'id',
      entityName: fieldParams.entityName || field_name,
      type:       fieldParams.type,
      views:      buildViews(fieldParams.views),
      uploader:   fieldParams.uploader,
      gallery:    fieldParams.gallery
    };

     field.foreignKey = resolveForeignKey(field);

    return field;
  };
});

angular.module('carnival')
.service('EntityResources', ["Configuration", "ActionFactory", function (Configuration, ActionFactory) {

  var getNestedForm = function(entity, stateName, field){
    if(!field.views[stateName] || !field.views[stateName].nested)
       return;

    entity.nestedForms[field.endpoint] = prepareEntityForState(field.endpoint, 'create', {field:field, parentEntity: entity});
    entity.nestedForms[field.endpoint].parentEntity = entity;
  };

  var getRelatedResources = function(entity, endpoint){
    var relatedField = Configuration.getEntity(endpoint);
    relatedField.getList().success(
      function (data, status, headers, config) {
        entity.relatedResources[endpoint] = data;
      });
  };

  var hasRelatedResources = function(state, type){
    return (state === 'edit' || state === 'create' || state === 'index') && isARelation(type);
  };

  var isARelation = function(type){
    return (type === 'belongsTo' || type === 'hasMany');
  };

  var prepareField = function(entityWrapper, stateName, field, isField){
    if (!entityWrapper.model.checkFieldView(field.name, stateName))
      return;
   

    entityWrapper.fields.unshift(field);
    if(!hasRelatedResources(stateName, field.type))
      return;

    getRelatedResources(entityWrapper, field.endpoint);
    if(!isField)
      getNestedForm(entityWrapper, stateName, field);
  };

  var prepareFields = function(entityWrapper, stateName, isField){
    entityWrapper.relatedResources = {};
    for (var i = entityWrapper.model.fields.length - 1; i >= 0; i -= 1) {
      var field = entityWrapper.model.fields[i];
      prepareField(entityWrapper, stateName, field, isField);
    }
  };

  var prepareActions = function(entityWrapper, stateName, isField){
    var actionObj =  ActionFactory.buildAction(entityWrapper, stateName, isField);
    entityWrapper[actionObj.name] = actionObj.value;
  };

  var prepareEntityForState = function(entityName, stateName, isField){
    var entityWrapper = {};
    entityWrapper.nestedForms = {};
    entityWrapper.model = Configuration.getEntity(entityName);
    entityWrapper.name = entityWrapper.model.name;
    entityWrapper.label = entityWrapper.model.label;
    entityWrapper.identifier = entityWrapper.model.identifier;
    entityWrapper.fields = [];
    entityWrapper.datas = {};
    prepareFields(entityWrapper, stateName, isField);
    prepareActions(entityWrapper, stateName, isField);
    return entityWrapper;
  };

  this.prepareForState = function(entityName, stateName, isField){
    return prepareEntityForState(entityName, stateName, isField);
  };

  this.prepareForCreateState = function(entityName){
    return this.prepareForState(entityName, 'create');
  };

  this.prepareForEditState = function(entityName){
    return this.prepareForState(entityName, 'edit');
  };

  this.prepareForShowState = function(entityName){
    return this.prepareForState(entityName, 'show');
  };

  this.prepareForListState = function(entityName){
    return this.prepareForState(entityName, 'index');
  };
}]);

angular.module('carnival')
.service('EntityUpdater', function () {
  this.updateEntity = function(entity, fieldToUpdate, fieldData){
    if(fieldToUpdate.type === 'belongsTo'){
      entity.datas[fieldToUpdate.name] = fieldData;
      entity.relatedResources[fieldToUpdate.endpoint].push(fieldData);
    }else if(fieldToUpdate.type === 'hasMany'){
      entity.datas[fieldToUpdate.name].push(fieldData);
      entity.relatedResources[fieldToUpdate.endpoint].push(fieldData);
    }
  };
});

angular.module('carnival')

.provider('HttpAdapter', function () {

  var httpMethods = {

    getList: null

  };

  return {

    /* The callback will receive the Api URL and the entity's Name */
    getList: function (callback) {
      httpMethods.getList = callback;
    },

    getOne: function (callback) {
      httpMethods.getOne = callback;
    },

    $get: function () {
      return httpMethods;
    }

  };

});

angular.module('carnival')
.config(["$httpProvider", function ($httpProvider) {

  $httpProvider.interceptors.push(["$q", "$cacheFactory", "$timeout", "$rootScope", "loadingBar", function ($q, $cacheFactory, $timeout, $rootScope, loadingBar) {

    var totalReqs = 0;
    var completedReqs = 0;
    var startTimeout;

    function setComplete() {
      $timeout.cancel(startTimeout);
      loadingBar.complete();
      completedReqs = 0;
      totalReqs = 0;
    }

    function isCached(config) {
      var cache;
      var defaultCache = $cacheFactory.get('$http');
      var defaults = $httpProvider.defaults;
      if ((config.cache || defaults.cache) && config.cache !== false && (config.method === 'GET' || config.method === 'JSONP')) {
        cache = angular.isObject(config.cache) ? config.cache :
        angular.isObject(defaults.cache) ? defaults.cache : defaultCache;
      }
      var cached = cache !== undefined ? cache.get(config.url) !== undefined : false;

      if (config.cached !== undefined && cached !== config.cached) {
        return config.cached;
      }
      config.cached = cached;
      return cached;
    }

    return {

      'request': function (config) {
        if (!config.ignoreLoadingBar && !isCached(config)) {
          $rootScope.$broadcast('loadingBar.loading', {url: config.url});
          if (totalReqs === 0) {
            startTimeout = $timeout(function() { loadingBar.start(); }, loadingBar.latency);
          }
          totalReqs++;
          loadingBar.set(completedReqs / totalReqs);
        }
        return config;
      },

      'response': function(response) {
        if (!response.config.ignoreLoadingBar && !isCached(response.config)) {
          completedReqs++;
          $rootScope.$broadcast('loadingBar.loaded', { url: response.config.url, result: response });
          if (completedReqs >= totalReqs) {
            setComplete();
          } else {
            loadingBar.set(completedReqs / totalReqs);
          }
        }
        return response;
      },

      'responseError': function(rejection) {
        if (!rejection.config.ignoreLoadingBar && !isCached(rejection.config)) {
          completedReqs++;
          $rootScope.$broadcast('loadingBar.loaded', { url: rejection.config.url, result: rejection });
          if (completedReqs >= totalReqs) {
            setComplete();
          } else {
            loadingBar.set(completedReqs / totalReqs);
          }
        }
        return $q.reject(rejection);
      }
    };
  }]);

}]);

angular.module('carnival')
.provider('loadingBar', function () {
  return {

    latency: 100,
    size:    0.02,
    parent:  'body',

    template: '<div id="loading-bar">' +
                '<div class="bar">' +
                  '<div class="peg"></div>' +
                '</div>' +
              '</div>',

    $get: ["$injector", "$document", "$timeout", "$rootScope", function ($injector, $document, $timeout, $rootScope) {

      var $animate;

      var $parentSelector    = this.parent,
          loadingBarTemplate = angular.element(this.template),
          loadingBar         = loadingBarTemplate.find('div').eq(0);

      var incTimeout,
          completeTimeout,
          started = false,
          status  = 0;

      var size = this.size;

      function start() {
        if (!$animate) $animate = $injector.get('$animate');
        var $parent = $document.find($parentSelector).eq(0);
        $timeout.cancel(completeTimeout);
        if (started) return;
        $rootScope.$broadcast('loadingbar.started');
        started = true;
        $animate.enter(loadingBarTemplate, $parent);
        set(size);
      }

      function set(size) {
        if (!started) return;
        var percent = (size * 100) + '%';
        loadingBar.css('width', percent);
        status = size;
        $timeout.cancel(incTimeout);
        incTimeout = $timeout(function () {
          inc();
        }, 200);
      }

      function inc() {
        if (status >= 1) return;
        var rnd = 0;
        if (status >= 0 && status < 0.25) {
          rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        } else if (status >= 0.25 && status < 0.65) {
          rnd = (Math.random() * 3) / 100;
        } else if (status >= 0.65 && status < 0.9) {
          rnd = (Math.random() * 2) / 100;
        } else if (status >= 0.9 && status < 0.99) {
          rnd = 0.005;
        } else {
          rnd = 0;
        }
        var pct = status + rnd;
        set(pct);
      }

      function completeAnimation() {
        status  = 0;
        started = false;
      }

      function complete() {
        if (!$animate) $animate = $injector.get('$animate');
        $rootScope.$broadcast('loadingBar.completed');
        set(1);
        $timeout.cancel(completeTimeout);
        completeTimeout = $timeout(function() {
          var promise = $animate.leave(loadingBarTemplate, completeAnimation);
          if (promise && promise.then) {
            promise.then(completeAnimation);
          }
        }, 500);
      }

      return {
        start    : start,
        set      : set,
        status   : status,
        inc      : inc,
        complete : complete,
        latency  : this.latency
      };

    }]

  };
});

angular.module('carnival')
.factory('notificationFactory', function () {
  var notifications = [];
  return notifications;
});

angular.module('carnival')
.service('Notification', ["$timeout", "notificationFactory", function ($timeout, notificationFactory) {

  var notificationKiller = function () {
    notificationFactory.splice(notificationFactory.length - 1, 1);
  };

  function Notification (message, type) {
    this.message = message;
    this.type = type;
    notificationFactory.unshift(this);
    $timeout(notificationKiller, 3000);
  }

  return Notification;

}]);

angular.module('carnival')
.service('RequestBuilder', ["HttpAdapter", function (HttpAdapter) {
  
  var prebuildRequest = function(method, params){
    var request = {};
    request.params = {};
    request.method = method;
    addExtraParams(request, params.extraParams);
    return request;
  };

  var addExtraParams = function(request, extraParams){
    if(!extraParams)
      return;
    for(var key in extraParams){
      request.params[key] = extraParams[key];
    }
  };

  this.buildForGetList = function(params){
    var request = prebuildRequest('GET', params);
    request.url    = params.baseUrl + '/' + params.endpoint;
    request.params.offset = params.offset;
    request.params.limit  = params.limit;
    if (params.order && params.orderDir) {
      request.params.order    = params.order;
      request.params.orderDir = params.orderDir;
    }
    if (params.search)
      request.params.search = encodeURIComponent(JSON.stringify(params.search));
    return request;
  };

  this.buildForGetOne = function(params){
    var request = prebuildRequest('GET', params);
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    return request;
  };

  this.buildForDelete = function(params){
    var request = prebuildRequest('DELETE', params);
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    return request;
  };

  this.buildForCreate = function(params){
    var request = prebuildRequest('POST', params);
    request.url    = params.baseUrl + '/' + params.endpoint;
    request.data = params.entityData;
    return request;
  };

  this.buildForUpdate = function(params){
    var request = prebuildRequest('PUT', params);
    request.url    = params.baseUrl + '/' + params.endpoint + '/' + params.id;
    request.data = params.entityData;
    return request;
  };
}]);


angular.module('carnival')
.service('ParametersParser', function () {

  var getFieldByName = function(name, fields){

    for(var i = 0; i < fields.length; i++){
      var field = fields[i];
      if(field.name === name)
        return field;
    }

    return null;
  };

  var getFieldByEntityName = function(entityName, fields){

    for(var i = 0; i < fields.length; i++){
      var field = fields[i];
      if(field.entityName === entityName)
        return field;
    }

    return null;
  };


  var buildHasManyParams = function(field, values){
    var params = [];
    for(var i = 0; i < values.length; i++){
      var value = values[i];
      params.push(value[field.identifier]);
    }
    return params;
  };

  var buildParentEntityParams = function(entity){
    var parsedParams = {};
    var parentEntity = entity.parentEntity;
    if(!parentEntity)
      return parsedParams;
    var field = getFieldByEntityName(parentEntity.name, entity.fields);
    if(!field)
      return {};
    if(field.type === 'hasMany'){
      parsedParams[field.name] = buildHasManyParams(field, [parentEntity.datas]);
    }else if(field.type === 'belongsTo'){
      parsedParams[field.foreignKey] = parentEntity.datas[field.identifier];
    }

    return parsedParams;
  };

  this.parse = function(params, entity){
    var parsedParams = {};
    for(var paramName in params){
      var field = getFieldByName(paramName, entity.fields);
      if(!field || field.type != 'hasMany'){
        parsedParams[paramName] = params[paramName];
        continue;
      }

      parsedParams[paramName] = buildHasManyParams(field, params[paramName]);
    }

    var parentEntityParams = buildParentEntityParams(entity);
    return angular.extend(parsedParams, parentEntityParams);
  };
});

angular.module('carnival')
.service('Uploader', ["$http", "Configuration", function ($http, Configuration) {

  var upload = function (requestUrl, file) {
    var formData = new FormData();
    formData.append('file', file);
    return $http.post(requestUrl, formData, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    });
  };

  return {
    upload: upload
  };

}]);

angular.module('carnival')
.service('urlParams', ["$rootScope", "$location", "$state", function ($rootScope, $location, $state) {

  this.defaultParams = {
    page: 1
  };

  this.setParam = function (name, value, reload) {
    if (value === '') value = null;
    $location.search(name, value);
    if (reload) this.emitLoadEvent();
  };

  this.getParam = function (name) {
    var value = $location.search()[name];
    return !isNaN(parseInt(value)) && isFinite(value) ? parseInt(value, 10) : value || this.defaultParams[name];
  };

  this.getAllParams = function () {
    return $location.search();
  };

  this.clearParams = function () {
    Object.keys($location.search()).forEach(function (param) {
      $location.search(param, null);
    });
  };

  this.emitLoadEvent = function () {
    $rootScope.$broadcast('paramsChange');
  };

  this.reload = this.emitLoadEvent;

}]);

angular.module('carnival')
.service('utils', function () {

  var cutString = function (str, n) {
    if (!n) return str;
    if (!str) throw 'cutString: to cut a string you must pass a string!';
    if (str.length <= n) return str;
    str = str.substr(0, n - 1) + '...';
    return str;
  };

  return {
    cutString: cutString
  };

});

angular.module('carnival')
.controller('CreateController', ["$scope", "$stateParams", "$state", "Configuration", "Notification", "EntityResources", function ($scope, $stateParams, $state, Configuration, Notification, EntityResources) {

  var entity = $scope.entity = {};


  var init = function () {
    $scope.entity = EntityResources.prepareForCreateState($stateParams.entity);
    entity = $scope.entity;
  };

  init();

}]);

angular.module('carnival')
.controller('EditController', ["$rootScope", "$scope", "$stateParams", "$state", "Configuration", "EntityResources", function ($rootScope, $scope, $stateParams, $state, Configuration, EntityResources) {

  var entity = $scope.entity = {};
  

  var init = function () {
    $scope.entity = entity = EntityResources.prepareForEditState($stateParams.entity);

    entity.model.getOne($stateParams.id)
    .success(function (data) {
      entity.id = $stateParams.id;
      entity.datas = data;
      for(var formName in entity.nestedForms){
        //entity.nestedForms[formName].datas[entity.name] = data;
      }
    });
  };

  init();

}]);

angular.module('carnival')
.controller('ListController', ["$rootScope", "$scope", "$stateParams", "$state", "Configuration", "Notification", "urlParams", "EntityResources", function ($rootScope, $scope, $stateParams, $state, Configuration, Notification, urlParams, EntityResources) {

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
      entity.model.getList(offset, limit, urlParams.getParam('order'), urlParams.getParam('orderDir'), getSearchParams())
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

}]);

angular.module('carnival')
.controller('ShowController', ["$scope", "$stateParams", "$state", "Configuration", "EntityResources", function ($scope, $stateParams, $state, Configuration, EntityResources) {

  var entity = $scope.entity = {};

  $scope.buttonAction = function(){
    $state.go('main.edit', { entity: entity.name, id: entity.datas.id });
  };

  var init = function () {
    entity = $scope.entity = EntityResources.prepareForShowState($stateParams.entity);

    entity.model.getOne($stateParams.id)
    .success(function (data) {
      entity.datas = data;
    });

  };

  init();

}]);

angular.module('carnival')
.controller('MainController', ["$scope", "Configuration", function ($scope, Configuration) {

  var app_name = $scope.app_name = Configuration.getAppName(),
      menu_items = $scope.menu_items = Configuration.getNavbarItems();

}]);

angular.module('carnival.templates', ['components/button/button.html', 'components/delete-button/delete-button.html', 'components/fields/belongs-to/belongs-to.html', 'components/fields/boolean/boolean.html', 'components/fields/file/file.html', 'components/fields/has-many/has-many.html', 'components/fields/number/number.html', 'components/fields/select/select.html', 'components/fields/string/string.html', 'components/fields/text/text.html', 'components/fields/wysiwyg/wysiwyg.html', 'components/form/form.html', 'components/gallery/gallery.html', 'components/listing-field-belongs-to/listing-field-belongs-to.html', 'components/listing-field-file/listing-field-file.html', 'components/listing-field-has-many/listing-field-has-many.html', 'components/listing-field/listing-field.html', 'components/listing/listing.html', 'components/navbar/navbar.html', 'components/notification/notification.html', 'components/order-controller/order-controller.html', 'components/pagination-controller/pagination-controller.html', 'components/quickfilter-controller/quickfilter-controller.html', 'components/search-controller/search-controller.html', 'components/uploader/uploader.html', 'states/main.create/create.html', 'states/main.edit/edit.html', 'states/main.list/list.html', 'states/main.show/show.html', 'states/main/main.html']);

angular.module("components/button/button.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/button/button.html",
    "<a class=\"btn btn-{{ style }} btn-{{ size }}\">{{ label }}</a>");
}]);

angular.module("components/delete-button/delete-button.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/delete-button/delete-button.html",
    "<span>\n" +
    "  <a ng-hide=\"isDeleting\" class=\"btn btn-danger btn-xs\" ng-click=\"start()\">{{ 'Delete' | translate }}</a>\n" +
    "  <a ng-show=\"isDeleting\" class=\"btn btn-default btn-xs\" ng-click=\"cancel()\">{{ 'Cancel' | translate }}</a>\n" +
    "  <a ng-show=\"isDeleting\" class=\"btn btn-danger btn-xs\" ng-click=\"confirm()\">{{ 'Confirm' | translate }}</a>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/fields/belongs-to/belongs-to.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/belongs-to/belongs-to.html",
    "<div>\n" +
    "  <carnival-select-field data=\"datas[field.foreignKey]\" field=\"field.field\" identifier=\"field.identifier\" items=\"relatedResources[field.endpoint]\" editable=\"editable\">\n" +
    "\n" +
    "  </carnival-select-field>\n" +
    "  <a ng-if='canShowNestedForm(field)' ng-init='nestedFormIndex.value = nestedFormIndex.value + 1; formIndex = nestedFormIndex.value' class=\"btn btn-default btn-xs\"  ng-click=\"open(formIndex)\">Create</a>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/boolean/boolean.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/boolean/boolean.html",
    "<input type=\"checkbox\" ng-model=\"data\"></input>\n" +
    "");
}]);

angular.module("components/fields/file/file.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/file/file.html",
    "<div>\n" +
    "  <div>\n" +
    "    <img ng-if=\"checkIfIsImage(data)\" ng-src=\"{{ data }}\" width=\"200\" height=\"120\"/>\n" +
    "    <a ng-if=\"!checkIfIsImage(data)\" href=\"{{ data }}\">{{ data }}</a>\n" +
    "  </div>\n" +
    "  <div ng-if=\"editable\">\n" +
    "    <carnival-string-field label=\"field.label\" data=\"$parent.data\" editable=\"editable\"></carnival-string-field>\n" +
    "    <div ng-if=\"checkIfHasUploader()\">\n" +
    "      <carnival-uploader uploader=\"field.uploader\" file-url=\"$parent.$parent.data\"></carnival-uploader>\n" +
    "    </div>\n" +
    "    <div ng-if=\"checkIfHasGallery()\">\n" +
    "      <carnival-gallery gallery=\"field.gallery\" file-url=\"$parent.$parent.data\"></carnival-gallery>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/has-many/has-many.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/has-many/has-many.html",
    "<div>\n" +
    "  <span ng-show='canShow()' >\n" +
    "    <select ng-model=\"selectedHasMany\" ng-options=\"item[field.identifier] as utils.cutString(item[field.field], 25) for item in relatedResources[field.endpoint]\">\n" +
    "    </select>\n" +
    "    <a class=\"btn btn-default btn-xs\" ng-click=\"addHasManyOption()\">Add</a>\n" +
    "  </span>\n" +
    "  <a ng-if='canOpenNestedForm()' ng-init='nestedFormIndex.value = nestedFormIndex.value + 1; formIndex = nestedFormIndex.value' class=\"btn btn-default btn-xs\"  ng-click=\"open(formIndex)\">Create</a>\n" +
    "  <ul class='has-many-field-list'>\n" +
    "    <li ng-repeat='data in datas[field.name]'>\n" +
    "      {{data[field.field]}}\n" +
    "      <a id='removeHasManyOption' ng-click='remove(data.id);' class=\"btn btn-default btn-xs\">Delete</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/number/number.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/number/number.html",
    "<input class=\"form-control\" type=\"number\" placeholder=\"{{ label }}\" ng-model=\"data\"></input>\n" +
    "");
}]);

angular.module("components/fields/select/select.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/select/select.html",
    "<select ng-model=\"data\" ng-options=\"item[identifier] as utils.cutString(item[field], 25) for item in items\">\n" +
    "</select>\n" +
    "");
}]);

angular.module("components/fields/string/string.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/string/string.html",
    "<input class=\"form-control\" type=\"text\" placeholder=\"{{ label }}\" ng-model=\"data\"></input>\n" +
    "");
}]);

angular.module("components/fields/text/text.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/text/text.html",
    "<textarea class=\"form-control\" placeholder=\"{{ label }}\" ng-model=\"data\"></textarea>\n" +
    "");
}]);

angular.module("components/fields/wysiwyg/wysiwyg.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/wysiwyg/wysiwyg.html",
    "<div>\n" +
    "  <div text-angular ng-model=\"data\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/form/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/form/form.html",
    "<form class=\"simple-form form-horizontal\" ng-init=\"nestedFormIndex = {value: 0}\" novalidate>\n" +
    "  <div class=\"form-group\" ng-repeat=\"field in fields\">\n" +
    "    <label ng-if='canShow(field)' class=\"col-sm-2 control-label\">{{ field.label }}</label>\n" +
    "    <div class=\"col-sm-10\" ng-switch=\"field.type\">\n" +
    "      <!-- Fields -->\n" +
    "      <carnival-text-field ng-switch-when=\"text\" data=\"datas[field.name]\" label=\"field.label\" editable=\"editable\"></carnival-text-field>\n" +
    "      <carnival-wysiwyg-field ng-switch-when=\"wysiwyg\" data=\"datas[field.name]\" label=\"field.label\" editable=\"editable\"></carnival-wysiwyg-field>\n" +
    "      <carnival-boolean-field ng-switch-when=\"boolean\" data=\"datas[field.name]\" label=\"field.label\" editable=\"editable\"></carnival-boolean-field>\n" +
    "      <carnival-string-field ng-switch-when=\"string\" data=\"datas[field.name]\" label=\"field.label\" editable=\"editable\"></carnival-string-field>\n" +
    "      <carnival-number-field ng-switch-when=\"number\" data=\"datas[field.name]\" label=\"field.label\" editable=\"editable\"></carnival-number-field>\n" +
    "      <carnival-file-field ng-switch-when=\"file\" data=\"datas[field.name]\" field=\"field\" editable=\"editable\"></carnival-file-field>\n" +
    "      <carnival-belongs-to-field ng-if='canShow(field)' ng-switch-when=\"belongsTo\" nested-form-index=\"nestedFormIndex\" entity=\"entity\" field=\"field\" datas=\"entity.datas\" action=\"entity.action\" related-resources=\"entity.relatedResources\" editable=\"true\"></carnival-belongs-to-field>\n" +
    "      <carnival-has-many-field ng-if='canShow(field)' ng-switch-when=\"hasMany\" entity=\"entity\" nested-form-index=\"nestedFormIndex\" field=\"field\" datas=\"entity.datas\" action=\"entity.action\" related-resources=\"entity.relatedResources\" state=\"{{state}}\" editable=\"true\"></carnival-has-many-field>\n" +
    "      <carnival-text-field ng-switch-default data=\"datas[field.name]\" label=\"field.label\" editable=\"editable\"></carnival-text-field>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <label class=\"col-sm-2 control-label\">\n" +
    "    <carnival-button label=\"{{ action.label | translate }}\" style=\"success\" size=\"sm\" ng-click=\"buttonAction()\"></carnival-button>\n" +
    "  </label>\n" +
    "</form>\n" +
    "");
}]);

angular.module("components/gallery/gallery.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/gallery/gallery.html",
    "<div>\n" +
    "  <carnival-button label=\"Open Gallery\" style=\"default\" size=\"sm\" ng-click=\"open()\"></carnival-button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/listing-field-belongs-to/listing-field-belongs-to.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-belongs-to/listing-field-belongs-to.html",
    "<span>\n" +
    "  <a href=\"{{ getUrl() }}\">{{ getLabel() }}</a>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/listing-field-file/listing-field-file.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-file/listing-field-file.html",
    "<div>\n" +
    "  <img ng-if=\"checkIfIsImage(item[field.name])\" ng-src=\"{{ item[field.name] }}\" width=\"200\" height=\"120\"/>\n" +
    "  <a ng-if=\"!checkIfIsImage(item[field.name])\" href=\"{{ item[field.name] }}\">{{ item[field.name] }}</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/listing-field-has-many/listing-field-has-many.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-has-many/listing-field-has-many.html",
    "<span>\n" +
    "  <a href=\"{{ getUrl() }}\">{{ getLabel() }}</a>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/listing-field/listing-field.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field/listing-field.html",
    "<span ng-switch=\"field.type\">\n" +
    "  <carnival-listing-field-belongs-to ng-switch-when=\"belongsTo\" item=\"item\" field=\"field\"></carnival-listing-field-belongs-to>\n" +
    "  <carnival-listing-field-has-many ng-switch-when=\"hasMany\" item=\"item\" field=\"field\"></carnival-listing-field-has-many>\n" +
    "  <carnival-listing-field-file ng-switch-when=\"file\" item=\"item\" field=\"field\"></carnival-listing-field-file>\n" +
    "  <span ng-switch-default>\n" +
    "    {{item[field.name]}}\n" +
    "  </span>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/listing/listing.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing/listing.html",
    "<table class=\"table table-hover\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th ng-repeat=\"field in fields\">\n" +
    "        {{ field.label }}\n" +
    "        <carnival-order-ctrl field=\"field.name\"></carnival-order-ctrl>\n" +
    "      </th>\n" +
    "      <th ng-if=\"actions\" style=\"width: 30%\">\n" +
    "        {{ 'Actions' | translate }}\n" +
    "      </th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"data in datas\">\n" +
    "      <td ng-repeat=\"field in fields\">\n" +
    "        <carnival-listing-field item=\"data\" field=\"field\"></carnival-listing-field>\n" +
    "      </td>\n" +
    "      <td>\n" +
    "        <carnival-button label=\"{{ 'Show' | translate }}\" style=\"primary\" size=\"xs\" ng-click=\"actions.show(data[identifier])\"></carnival-button>\n" +
    "        <carnival-button label=\"{{ 'Edit' | translate }}\" style=\"warning\" size=\"xs\" ng-click=\"actions.edit(data[identifier])\"></carnival-button>\n" +
    "        <carnival-delete-button item-id=\"data[identifier]\" action=\"actions.delete\"></carnival-button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("components/navbar/navbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/navbar/navbar.html",
    "<div class=\"navbar navbar-default\">\n" +
    "  <div class=\"container\">\n" +
    "  <a class=\"navbar-brand\">{{ appName }}</a>\n" +
    "  <ul class=\"nav navbar-nav\">\n" +
    "    <li ng-class=\"{ active: checkSelEntity($index) }\" ng-repeat=\"item in menuItems\">\n" +
    "    <a href=\"{{ buildUrl(item.link) }}\" ng-click=\"resetPage()\">{{ item.label }}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/notification/notification.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/notification/notification.html",
    "<div>\n" +
    "  <div ng-repeat=\"notification in notifications\" class=\"alert alert-{{ notification.type }}\">{{ notification.message }}</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/order-controller/order-controller.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/order-controller/order-controller.html",
    "<a ng-show=\"checkDirAsc()\" style=\"font-size: 0.75em; cursor: pointer\" class=\"glyphicon glyphicon-chevron-up\" ng-click=\"toggleOrder()\"></a>\n" +
    "<a ng-show=\"!checkDirAsc()\" style=\"font-size: 0.75em; cursor: pointer\" class=\"glyphicon glyphicon-chevron-down\" ng-click=\"toggleOrder()\"></a>\n" +
    "");
}]);

angular.module("components/pagination-controller/pagination-controller.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/pagination-controller/pagination-controller.html",
    "<nav>\n" +
    "  <ul class=\"pagination pagination-sm\" style=\"cursor: pointer;\">\n" +
    "\n" +
    "    <li ng-class=\"{ disabled: currentPage === 1 }\">\n" +
    "      <a ng-click=\"prevPage()\">&laquo;</a>\n" +
    "    </li>\n" +
    "\n" +
    "    <li ng-show=\"currentPage > 2\">\n" +
    "      <a ng-click=\"jumpTo(currentPage - 2)\">{{ currentPage - 2 }}</a>\n" +
    "    </li>\n" +
    "\n" +
    "    <li ng-show=\"currentPage > 1\">\n" +
    "      <a ng-click=\"jumpTo(currentPage - 1)\">{{ currentPage - 1 }}</a>\n" +
    "    </li>\n" +
    "\n" +
    "    <li class=\"active\">\n" +
    "      <a>{{ currentPage }}</a>\n" +
    "    </li>\n" +
    "\n" +
    "    <li ng-show=\"currentPage < totalPages\">\n" +
    "      <a ng-click=\"jumpTo(currentPage + 1)\">{{ currentPage + 1}}</a>\n" +
    "    </li>\n" +
    "\n" +
    "    <li ng-show=\"currentPage < totalPages - 1\">\n" +
    "      <a ng-click=\"jumpTo(currentPage + 2)\">{{ currentPage + 2}}</a>\n" +
    "    </li>\n" +
    "\n" +
    "    <li ng-class=\"{ disabled: currentPage === totalPages }\">\n" +
    "      <a ng-click=\"nextPage()\">&raquo;</a>\n" +
    "    </li>\n" +
    "\n" +
    "  </ul>\n" +
    "</nav>\n" +
    "");
}]);

angular.module("components/quickfilter-controller/quickfilter-controller.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/quickfilter-controller/quickfilter-controller.html",
    "<span>\n" +
    "  <carnival-button ng-class=\"{ disabled: isSelected(filter.field, filter.value()) }\" ng-repeat=\"filter in filters\" label=\"{{ filter.label }}\" style=\"info\" size=\"sm\" ng-click=\"setFilter(filter.field, filter.value())\"></carnival-button>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/search-controller/search-controller.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/search-controller/search-controller.html",
    "<div>\n" +
    "  <h4>{{ 'Search' | translate }}</h4>\n" +
    "  <hr/>\n" +
    "    <p ng-repeat=\"field in fields\" ng-if=\"field.views.index.searchable\" ng-switch=\"field.type\">\n" +
    "      <label ng-if=\"field.type !== 'hasMany'\">{{ field.label }}</label>\n" +
    "      <carnival-text-field ng-switch-when=\"text\" label=\"field.label\" data=\"searchParams[field.name]\" editable=\"true\"></carnival-text-field>\n" +
    "      <carnival-string-field ng-switch-when=\"string\" label=\"field.label\" data=\"searchParams[field.name]\" editable=\"true\"></carnival-string-field>\n" +
    "      <carnival-select-field ng-switch-when=\"belongsTo\" editable=\"true\" field=\"field.field\" identifier=\"field.identifier\" items=\"relatedResources[field.endpoint]\" data=\"searchParams[field.foreignKey]\"></carnival-select-field>\n" +
    "      <carnival-number-field ng-switch-when=\"number\" data=\"searchParams[field.name]\" label=\"field.label\" editable=\"true\"></carnival-number-field>\n" +
    "    </p>\n" +
    "  <hr/>\n" +
    "  <carnival-button label=\"Submit\" size=\"sm\" style=\"default\" ng-click=\"submit()\"></carnival-button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/uploader/uploader.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/uploader/uploader.html",
    "<div>\n" +
    "  <input type=\"file\" file-input=\"files\"></input>\n" +
    "  <carnival-button label=\"Upload\" style=\"default\" size=\"sm\" ng-click=\"upload()\"></carnival-button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("states/main.create/create.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main.create/create.html",
    "<div class=\"container\">\n" +
    "\n" +
    "  <h3>{{ 'Create' | translate }} {{ entity.label }}</h3>\n" +
    "  <carnival-form entity='entity' fields=\"entity.fields\" action=\"entity.action\" datas=\"entity.datas\" state=\"create\" related-resources=\"entity.relatedResources\" editable=\"true\"></carnival-form>\n" +
    "  \n" +
    "  <div ng-if=\"entity.nestedForms[field.endpoint]\" ng-show=\"entity.nestedForms[field.endpoint].opened\" class='nested-form-modal' ng-repeat=\"field in entity.fields\">\n" +
    "    <div class=\"nested-form-modal-content\">\n" +
    "      <h3>{{ 'Create' | translate }} {{ entity.nestedForms[field.endpoint].label }}</h3>\n" +
    "      <carnival-form type='nested' entity=\"entity.nestedForms[field.endpoint]\" fields=\"entity.nestedForms[field.endpoint].fields\" datas=\"entity.nestedForms[field.endpoint].datas\" action=\"entity.nestedForms[field.endpoint].action\" state=\"create\" related-resources=\"entity.nestedForms[field.endpoint].relatedResources\" editable=\"true\"></carnival-form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("states/main.edit/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main.edit/edit.html",
    "<div class=\"container\">\n" +
    "\n" +
    "  <h3>{{ 'Edit' | translate }} {{ entity.label }}</h3>\n" +
    "  <carnival-form type='normal' entity=\"entity\" fields=\"entity.fields\" datas=\"entity.datas\" action=\"entity.action\" state=\"edit\" related-resources=\"entity.relatedResources\" editable=\"true\"></carnival-form>\n" +
    "  <div ng-if=\"entity.nestedForms[field.endpoint]\" ng-show=\"entity.nestedForms[field.endpoint].opened\" class='nested-form-modal' ng-repeat=\"field in entity.fields\">\n" +
    "    <div class=\"nested-form-modal-overlay\" ng-click=\"entity.nestedForms[field.endpoint].opened = false\">\n" +
    "    </div>\n" +
    "    <div class=\"nested-form-modal-content\">\n" +
    "      <h3>{{ 'Create' | translate }} {{ entity.nestedForms[field.endpoint].label }}</h3>\n" +
    "      <carnival-form type='nested' entity=\"entity.nestedForms[field.endpoint]\" fields=\"entity.nestedForms[field.endpoint].fields\" datas=\"entity.nestedForms[field.endpoint].datas\" action=\"entity.nestedForms[field.endpoint].action\" state=\"create\" related-resources=\"entity.nestedForms[field.endpoint].relatedResources\" editable=\"true\"></carnival-form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("states/main.list/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main.list/list.html",
    "<div class=\"container\">\n" +
    "  <div class=\"col-md-10\" style=\"text-align:left\">\n" +
    "    <h3>{{ 'List of' | translate }} {{ entity.label }}</h3>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-2\" style=\"text-align:right\">\n" +
    "    <carnival-button label=\"{{ 'Create' | translate }}\" style=\"success\" size=\"sm\" ng-click=\"entity.actions.create()\"></carnival-button>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3\"></div>\n" +
    "  <div class=\"col-md-9\">\n" +
    "    <carnival-quick-filter filters=\"entity.model.quickFilters\"></carnival-quick-filter>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <carnival-search-ctrl fields=\"entity.fields\" related-resources=\"entity.relatedResources\"></carnival-search-ctrl>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-9\">\n" +
    "    <carnival-listing entity-name=\"entity.name\" actions=\"entity.actions\" identifier=\"entity.identifier\" datas=\"entity.datas\" fields=\"entity.fields\"></carnival-listing>\n" +
    "    <carnival-pagination-ctrl current-page=\"pages.current\" total-pages=\"pages.total\"></carnival-pagination-ctrl>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("states/main.show/show.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main.show/show.html",
    "<div class=\"container\">\n" +
    "\n" +
    "  <h3>{{ 'Show' | translate }} {{ entity.label }}</h3>\n" +
    "\n" +
    "  <div class='row' ng-switch=\"field.type\" ng-repeat=\"field in entity.fields\">\n" +
    "    <label class=\"col-sm-2 control-label\">{{ field.label }}</label>\n" +
    "    <div class=\"col-sm-10\" ng-switch-when=\"belongsTo\">\n" +
    "      {{entity.datas[field.name][field.field]}}\n" +
    "    </div>\n" +
    "    <div class=\"col-sm-10\" ng-switch-when=\"hasMany\">\n" +
    "       <ul>\n" +
    "          <li ng-repeat=\"data in entity.datas[field.name]\">\n" +
    "            {{data[field.field]}}\n" +
    "          </li>\n" +
    "       </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-sm-10\" ng-switch-default>\n" +
    "      {{entity.datas[field.name]}}\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <label class=\"col-sm-2 control-label\">\n" +
    "    <carnival-button label=\"Edit\" style=\"warning\" size=\"sm\" ng-click=\"buttonAction()\"></carnival-button>\n" +
    "  </label>\n" +
    "</div>\n" +
    "");
}]);

angular.module("states/main/main.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main/main.html",
    "<carnival-navbar app-name=\"app_name\" menu-items=\"menu_items\"></carnival-navbar>\n" +
    "<div class=\"container\">\n" +
    "  <carnival-notification></carnival-notification>\n" +
    "</div>\n" +
    "<div ui-view></div>\n" +
    "");
}]);

/**
 * State-based routing for AngularJS
 * @version v0.2.13
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'ui.router';
}

(function (window, angular, undefined) {
/*jshint globalstrict:true*/
/*global angular:false*/
'use strict';

var isDefined = angular.isDefined,
    isFunction = angular.isFunction,
    isString = angular.isString,
    isObject = angular.isObject,
    isArray = angular.isArray,
    forEach = angular.forEach,
    extend = angular.extend,
    copy = angular.copy;

function inherit(parent, extra) {
  return extend(new (extend(function() {}, { prototype: parent }))(), extra);
}

function merge(dst) {
  forEach(arguments, function(obj) {
    if (obj !== dst) {
      forEach(obj, function(value, key) {
        if (!dst.hasOwnProperty(key)) dst[key] = value;
      });
    }
  });
  return dst;
}

/**
 * Finds the common ancestor path between two states.
 *
 * @param {Object} first The first state.
 * @param {Object} second The second state.
 * @return {Array} Returns an array of state names in descending order, not including the root.
 */
function ancestors(first, second) {
  var path = [];

  for (var n in first.path) {
    if (first.path[n] !== second.path[n]) break;
    path.push(first.path[n]);
  }
  return path;
}

/**
 * IE8-safe wrapper for `Object.keys()`.
 *
 * @param {Object} object A JavaScript object.
 * @return {Array} Returns the keys of the object as an array.
 */
function objectKeys(object) {
  if (Object.keys) {
    return Object.keys(object);
  }
  var result = [];

  angular.forEach(object, function(val, key) {
    result.push(key);
  });
  return result;
}

/**
 * IE8-safe wrapper for `Array.prototype.indexOf()`.
 *
 * @param {Array} array A JavaScript array.
 * @param {*} value A value to search the array for.
 * @return {Number} Returns the array index value of `value`, or `-1` if not present.
 */
function indexOf(array, value) {
  if (Array.prototype.indexOf) {
    return array.indexOf(value, Number(arguments[2]) || 0);
  }
  var len = array.length >>> 0, from = Number(arguments[2]) || 0;
  from = (from < 0) ? Math.ceil(from) : Math.floor(from);

  if (from < 0) from += len;

  for (; from < len; from++) {
    if (from in array && array[from] === value) return from;
  }
  return -1;
}

/**
 * Merges a set of parameters with all parameters inherited between the common parents of the
 * current state and a given destination state.
 *
 * @param {Object} currentParams The value of the current state parameters ($stateParams).
 * @param {Object} newParams The set of parameters which will be composited with inherited params.
 * @param {Object} $current Internal definition of object representing the current state.
 * @param {Object} $to Internal definition of object representing state to transition to.
 */
function inheritParams(currentParams, newParams, $current, $to) {
  var parents = ancestors($current, $to), parentParams, inherited = {}, inheritList = [];

  for (var i in parents) {
    if (!parents[i].params) continue;
    parentParams = objectKeys(parents[i].params);
    if (!parentParams.length) continue;

    for (var j in parentParams) {
      if (indexOf(inheritList, parentParams[j]) >= 0) continue;
      inheritList.push(parentParams[j]);
      inherited[parentParams[j]] = currentParams[parentParams[j]];
    }
  }
  return extend({}, inherited, newParams);
}

/**
 * Performs a non-strict comparison of the subset of two objects, defined by a list of keys.
 *
 * @param {Object} a The first object.
 * @param {Object} b The second object.
 * @param {Array} keys The list of keys within each object to compare. If the list is empty or not specified,
 *                     it defaults to the list of keys in `a`.
 * @return {Boolean} Returns `true` if the keys match, otherwise `false`.
 */
function equalForKeys(a, b, keys) {
  if (!keys) {
    keys = [];
    for (var n in a) keys.push(n); // Used instead of Object.keys() for IE8 compatibility
  }

  for (var i=0; i<keys.length; i++) {
    var k = keys[i];
    if (a[k] != b[k]) return false; // Not '===', values aren't necessarily normalized
  }
  return true;
}

/**
 * Returns the subset of an object, based on a list of keys.
 *
 * @param {Array} keys
 * @param {Object} values
 * @return {Boolean} Returns a subset of `values`.
 */
function filterByKeys(keys, values) {
  var filtered = {};

  forEach(keys, function (name) {
    filtered[name] = values[name];
  });
  return filtered;
}

// like _.indexBy
// when you know that your index values will be unique, or you want last-one-in to win
function indexBy(array, propName) {
  var result = {};
  forEach(array, function(item) {
    result[item[propName]] = item;
  });
  return result;
}

// extracted from underscore.js
// Return a copy of the object only containing the whitelisted properties.
function pick(obj) {
  var copy = {};
  var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
  forEach(keys, function(key) {
    if (key in obj) copy[key] = obj[key];
  });
  return copy;
}

// extracted from underscore.js
// Return a copy of the object omitting the blacklisted properties.
function omit(obj) {
  var copy = {};
  var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
  for (var key in obj) {
    if (indexOf(keys, key) == -1) copy[key] = obj[key];
  }
  return copy;
}

function pluck(collection, key) {
  var result = isArray(collection) ? [] : {};

  forEach(collection, function(val, i) {
    result[i] = isFunction(key) ? key(val) : val[key];
  });
  return result;
}

function filter(collection, callback) {
  var array = isArray(collection);
  var result = array ? [] : {};
  forEach(collection, function(val, i) {
    if (callback(val, i)) {
      result[array ? result.length : i] = val;
    }
  });
  return result;
}

function map(collection, callback) {
  var result = isArray(collection) ? [] : {};

  forEach(collection, function(val, i) {
    result[i] = callback(val, i);
  });
  return result;
}

/**
 * @ngdoc overview
 * @name ui.router.util
 *
 * @description
 * # ui.router.util sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 *
 */
angular.module('ui.router.util', ['ng']);

/**
 * @ngdoc overview
 * @name ui.router.router
 * 
 * @requires ui.router.util
 *
 * @description
 * # ui.router.router sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 */
angular.module('ui.router.router', ['ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router.state
 * 
 * @requires ui.router.router
 * @requires ui.router.util
 *
 * @description
 * # ui.router.state sub-module
 *
 * This module is a dependency of the main ui.router module. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 * 
 */
angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router
 *
 * @requires ui.router.state
 *
 * @description
 * # ui.router
 * 
 * ## The main module for ui.router 
 * There are several sub-modules included with the ui.router module, however only this module is needed
 * as a dependency within your angular app. The other modules are for organization purposes. 
 *
 * The modules are:
 * * ui.router - the main "umbrella" module
 * * ui.router.router - 
 * 
 * *You'll need to include **only** this module as the dependency within your angular app.*
 * 
 * <pre>
 * <!doctype html>
 * <html ng-app="myApp">
 * <head>
 *   <script src="js/angular.js"></script>
 *   <!-- Include the ui-router script -->
 *   <script src="js/angular-ui-router.min.js"></script>
 *   <script>
 *     // ...and add 'ui.router' as a dependency
 *     var myApp = angular.module('myApp', ['ui.router']);
 *   </script>
 * </head>
 * <body>
 * </body>
 * </html>
 * </pre>
 */
angular.module('ui.router', ['ui.router.state']);

angular.module('ui.router.compat', ['ui.router']);

/**
 * @ngdoc object
 * @name ui.router.util.$resolve
 *
 * @requires $q
 * @requires $injector
 *
 * @description
 * Manages resolution of (acyclic) graphs of promises.
 */
$Resolve.$inject = ['$q', '$injector'];
function $Resolve(  $q,    $injector) {
  
  var VISIT_IN_PROGRESS = 1,
      VISIT_DONE = 2,
      NOTHING = {},
      NO_DEPENDENCIES = [],
      NO_LOCALS = NOTHING,
      NO_PARENT = extend($q.when(NOTHING), { $$promises: NOTHING, $$values: NOTHING });
  

  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#study
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Studies a set of invocables that are likely to be used multiple times.
   * <pre>
   * $resolve.study(invocables)(locals, parent, self)
   * </pre>
   * is equivalent to
   * <pre>
   * $resolve.resolve(invocables, locals, parent, self)
   * </pre>
   * but the former is more efficient (in fact `resolve` just calls `study` 
   * internally).
   *
   * @param {object} invocables Invocable objects
   * @return {function} a function to pass in locals, parent and self
   */
  this.study = function (invocables) {
    if (!isObject(invocables)) throw new Error("'invocables' must be an object");
    var invocableKeys = objectKeys(invocables || {});
    
    // Perform a topological sort of invocables to build an ordered plan
    var plan = [], cycle = [], visited = {};
    function visit(value, key) {
      if (visited[key] === VISIT_DONE) return;
      
      cycle.push(key);
      if (visited[key] === VISIT_IN_PROGRESS) {
        cycle.splice(0, indexOf(cycle, key));
        throw new Error("Cyclic dependency: " + cycle.join(" -> "));
      }
      visited[key] = VISIT_IN_PROGRESS;
      
      if (isString(value)) {
        plan.push(key, [ function() { return $injector.get(value); }], NO_DEPENDENCIES);
      } else {
        var params = $injector.annotate(value);
        forEach(params, function (param) {
          if (param !== key && invocables.hasOwnProperty(param)) visit(invocables[param], param);
        });
        plan.push(key, value, params);
      }
      
      cycle.pop();
      visited[key] = VISIT_DONE;
    }
    forEach(invocables, visit);
    invocables = cycle = visited = null; // plan is all that's required
    
    function isResolve(value) {
      return isObject(value) && value.then && value.$$promises;
    }
    
    return function (locals, parent, self) {
      if (isResolve(locals) && self === undefined) {
        self = parent; parent = locals; locals = null;
      }
      if (!locals) locals = NO_LOCALS;
      else if (!isObject(locals)) {
        throw new Error("'locals' must be an object");
      }       
      if (!parent) parent = NO_PARENT;
      else if (!isResolve(parent)) {
        throw new Error("'parent' must be a promise returned by $resolve.resolve()");
      }
      
      // To complete the overall resolution, we have to wait for the parent
      // promise and for the promise for each invokable in our plan.
      var resolution = $q.defer(),
          result = resolution.promise,
          promises = result.$$promises = {},
          values = extend({}, locals),
          wait = 1 + plan.length/3,
          merged = false;
          
      function done() {
        // Merge parent values we haven't got yet and publish our own $$values
        if (!--wait) {
          if (!merged) merge(values, parent.$$values); 
          result.$$values = values;
          result.$$promises = result.$$promises || true; // keep for isResolve()
          delete result.$$inheritedValues;
          resolution.resolve(values);
        }
      }
      
      function fail(reason) {
        result.$$failure = reason;
        resolution.reject(reason);
      }

      // Short-circuit if parent has already failed
      if (isDefined(parent.$$failure)) {
        fail(parent.$$failure);
        return result;
      }
      
      if (parent.$$inheritedValues) {
        merge(values, omit(parent.$$inheritedValues, invocableKeys));
      }

      // Merge parent values if the parent has already resolved, or merge
      // parent promises and wait if the parent resolve is still in progress.
      extend(promises, parent.$$promises);
      if (parent.$$values) {
        merged = merge(values, omit(parent.$$values, invocableKeys));
        result.$$inheritedValues = omit(parent.$$values, invocableKeys);
        done();
      } else {
        if (parent.$$inheritedValues) {
          result.$$inheritedValues = omit(parent.$$inheritedValues, invocableKeys);
        }        
        parent.then(done, fail);
      }
      
      // Process each invocable in the plan, but ignore any where a local of the same name exists.
      for (var i=0, ii=plan.length; i<ii; i+=3) {
        if (locals.hasOwnProperty(plan[i])) done();
        else invoke(plan[i], plan[i+1], plan[i+2]);
      }
      
      function invoke(key, invocable, params) {
        // Create a deferred for this invocation. Failures will propagate to the resolution as well.
        var invocation = $q.defer(), waitParams = 0;
        function onfailure(reason) {
          invocation.reject(reason);
          fail(reason);
        }
        // Wait for any parameter that we have a promise for (either from parent or from this
        // resolve; in that case study() will have made sure it's ordered before us in the plan).
        forEach(params, function (dep) {
          if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
            waitParams++;
            promises[dep].then(function (result) {
              values[dep] = result;
              if (!(--waitParams)) proceed();
            }, onfailure);
          }
        });
        if (!waitParams) proceed();
        function proceed() {
          if (isDefined(result.$$failure)) return;
          try {
            invocation.resolve($injector.invoke(invocable, self, values));
            invocation.promise.then(function (result) {
              values[key] = result;
              done();
            }, onfailure);
          } catch (e) {
            onfailure(e);
          }
        }
        // Publish promise synchronously; invocations further down in the plan may depend on it.
        promises[key] = invocation.promise;
      }
      
      return result;
    };
  };
  
  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#resolve
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Resolves a set of invocables. An invocable is a function to be invoked via 
   * `$injector.invoke()`, and can have an arbitrary number of dependencies. 
   * An invocable can either return a value directly,
   * or a `$q` promise. If a promise is returned it will be resolved and the 
   * resulting value will be used instead. Dependencies of invocables are resolved 
   * (in this order of precedence)
   *
   * - from the specified `locals`
   * - from another invocable that is part of this `$resolve` call
   * - from an invocable that is inherited from a `parent` call to `$resolve` 
   *   (or recursively
   * - from any ancestor `$resolve` of that parent).
   *
   * The return value of `$resolve` is a promise for an object that contains 
   * (in this order of precedence)
   *
   * - any `locals` (if specified)
   * - the resolved return values of all injectables
   * - any values inherited from a `parent` call to `$resolve` (if specified)
   *
   * The promise will resolve after the `parent` promise (if any) and all promises 
   * returned by injectables have been resolved. If any invocable 
   * (or `$injector.invoke`) throws an exception, or if a promise returned by an 
   * invocable is rejected, the `$resolve` promise is immediately rejected with the 
   * same error. A rejection of a `parent` promise (if specified) will likewise be 
   * propagated immediately. Once the `$resolve` promise has been rejected, no 
   * further invocables will be called.
   * 
   * Cyclic dependencies between invocables are not permitted and will caues `$resolve`
   * to throw an error. As a special case, an injectable can depend on a parameter 
   * with the same name as the injectable, which will be fulfilled from the `parent` 
   * injectable of the same name. This allows inherited values to be decorated. 
   * Note that in this case any other injectable in the same `$resolve` with the same
   * dependency would see the decorated value, not the inherited value.
   *
   * Note that missing dependencies -- unlike cyclic dependencies -- will cause an 
   * (asynchronous) rejection of the `$resolve` promise rather than a (synchronous) 
   * exception.
   *
   * Invocables are invoked eagerly as soon as all dependencies are available. 
   * This is true even for dependencies inherited from a `parent` call to `$resolve`.
   *
   * As a special case, an invocable can be a string, in which case it is taken to 
   * be a service name to be passed to `$injector.get()`. This is supported primarily 
   * for backwards-compatibility with the `resolve` property of `$routeProvider` 
   * routes.
   *
   * @param {object} invocables functions to invoke or 
   * `$injector` services to fetch.
   * @param {object} locals  values to make available to the injectables
   * @param {object} parent  a promise returned by another call to `$resolve`.
   * @param {object} self  the `this` for the invoked methods
   * @return {object} Promise for an object that contains the resolved return value
   * of all invocables, as well as any inherited and local values.
   */
  this.resolve = function (invocables, locals, parent, self) {
    return this.study(invocables)(locals, parent, self);
  };
}

angular.module('ui.router.util').service('$resolve', $Resolve);


/**
 * @ngdoc object
 * @name ui.router.util.$templateFactory
 *
 * @requires $http
 * @requires $templateCache
 * @requires $injector
 *
 * @description
 * Service. Manages loading of templates.
 */
$TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
function $TemplateFactory(  $http,   $templateCache,   $injector) {

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromConfig
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a configuration object. 
   *
   * @param {object} config Configuration object for which to load a template. 
   * The following properties are search in the specified order, and the first one 
   * that is defined is used to create the template:
   *
   * @param {string|object} config.template html string template or function to 
   * load via {@link ui.router.util.$templateFactory#fromString fromString}.
   * @param {string|object} config.templateUrl url to load or a function returning 
   * the url to load via {@link ui.router.util.$templateFactory#fromUrl fromUrl}.
   * @param {Function} config.templateProvider function to invoke via 
   * {@link ui.router.util.$templateFactory#fromProvider fromProvider}.
   * @param {object} params  Parameters to pass to the template function.
   * @param {object} locals Locals to pass to `invoke` if the template is loaded 
   * via a `templateProvider`. Defaults to `{ params: params }`.
   *
   * @return {string|object}  The template html as a string, or a promise for 
   * that string,or `null` if no template is configured.
   */
  this.fromConfig = function (config, params, locals) {
    return (
      isDefined(config.template) ? this.fromString(config.template, params) :
      isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) :
      isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) :
      null
    );
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromString
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a string or a function returning a string.
   *
   * @param {string|object} template html template as a string or function that 
   * returns an html template as a string.
   * @param {object} params Parameters to pass to the template function.
   *
   * @return {string|object} The template html as a string, or a promise for that 
   * string.
   */
  this.fromString = function (template, params) {
    return isFunction(template) ? template(params) : template;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromUrl
   * @methodOf ui.router.util.$templateFactory
   * 
   * @description
   * Loads a template from the a URL via `$http` and `$templateCache`.
   *
   * @param {string|Function} url url of the template to load, or a function 
   * that returns a url.
   * @param {Object} params Parameters to pass to the url function.
   * @return {string|Promise.<string>} The template html as a string, or a promise 
   * for that string.
   */
  this.fromUrl = function (url, params) {
    if (isFunction(url)) url = url(params);
    if (url == null) return null;
    else return $http
        .get(url, { cache: $templateCache, headers: { Accept: 'text/html' }})
        .then(function(response) { return response.data; });
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromProvider
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template by invoking an injectable provider function.
   *
   * @param {Function} provider Function to invoke via `$injector.invoke`
   * @param {Object} params Parameters for the template.
   * @param {Object} locals Locals to pass to `invoke`. Defaults to 
   * `{ params: params }`.
   * @return {string|Promise.<string>} The template html as a string, or a promise 
   * for that string.
   */
  this.fromProvider = function (provider, params, locals) {
    return $injector.invoke(provider, null, locals || { params: params });
  };
}

angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);

var $$UMFP; // reference to $UrlMatcherFactoryProvider

/**
 * @ngdoc object
 * @name ui.router.util.type:UrlMatcher
 *
 * @description
 * Matches URLs against patterns and extracts named parameters from the path or the search
 * part of the URL. A URL pattern consists of a path pattern, optionally followed by '?' and a list
 * of search parameters. Multiple search parameter names are separated by '&'. Search parameters
 * do not influence whether or not a URL is matched, but their values are passed through into
 * the matched parameters returned by {@link ui.router.util.type:UrlMatcher#methods_exec exec}.
 * 
 * Path parameter placeholders can be specified using simple colon/catch-all syntax or curly brace
 * syntax, which optionally allows a regular expression for the parameter to be specified:
 *
 * * `':'` name - colon placeholder
 * * `'*'` name - catch-all placeholder
 * * `'{' name '}'` - curly placeholder
 * * `'{' name ':' regexp|type '}'` - curly placeholder with regexp or type name. Should the
 *   regexp itself contain curly braces, they must be in matched pairs or escaped with a backslash.
 *
 * Parameter names may contain only word characters (latin letters, digits, and underscore) and
 * must be unique within the pattern (across both path and search parameters). For colon 
 * placeholders or curly placeholders without an explicit regexp, a path parameter matches any
 * number of characters other than '/'. For catch-all placeholders the path parameter matches
 * any number of characters.
 * 
 * Examples:
 * 
 * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
 *   trailing slashes, and patterns have to match the entire path, not just a prefix.
 * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
 *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
 * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
 * * `'/user/{id:[^/]*}'` - Same as the previous example.
 * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
 *   parameter consists of 1 to 8 hex digits.
 * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
 *   path into the parameter 'path'.
 * * `'/files/*path'` - ditto.
 * * `'/calendar/{start:date}'` - Matches "/calendar/2014-11-12" (because the pattern defined
 *   in the built-in  `date` Type matches `2014-11-12`) and provides a Date object in $stateParams.start
 *
 * @param {string} pattern  The pattern to compile into a matcher.
 * @param {Object} config  A configuration object hash:
 * @param {Object=} parentMatcher Used to concatenate the pattern/config onto
 *   an existing UrlMatcher
 *
 * * `caseInsensitive` - `true` if URL matching should be case insensitive, otherwise `false`, the default value (for backward compatibility) is `false`.
 * * `strict` - `false` if matching against a URL with a trailing slash should be treated as equivalent to a URL without a trailing slash, the default value is `true`.
 *
 * @property {string} prefix  A static prefix of this pattern. The matcher guarantees that any
 *   URL matching this matcher (i.e. any string for which {@link ui.router.util.type:UrlMatcher#methods_exec exec()} returns
 *   non-null) will start with this prefix.
 *
 * @property {string} source  The pattern that was passed into the constructor
 *
 * @property {string} sourcePath  The path portion of the source property
 *
 * @property {string} sourceSearch  The search portion of the source property
 *
 * @property {string} regex  The constructed regex that will be used to match against the url when 
 *   it is time to determine which url will match.
 *
 * @returns {Object}  New `UrlMatcher` object
 */
function UrlMatcher(pattern, config, parentMatcher) {
  config = extend({ params: {} }, isObject(config) ? config : {});

  // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
  //   '*' name
  //   ':' name
  //   '{' name '}'
  //   '{' name ':' regexp '}'
  // The regular expression is somewhat complicated due to the need to allow curly braces
  // inside the regular expression. The placeholder regexp breaks down as follows:
  //    ([:*])([\w\[\]]+)              - classic placeholder ($1 / $2) (search version has - for snake-case)
  //    \{([\w\[\]]+)(?:\:( ... ))?\}  - curly brace placeholder ($3) with optional regexp/type ... ($4) (search version has - for snake-case
  //    (?: ... | ... | ... )+         - the regexp consists of any number of atoms, an atom being either
  //    [^{}\\]+                       - anything other than curly braces or backslash
  //    \\.                            - a backslash escape
  //    \{(?:[^{}\\]+|\\.)*\}          - a matched set of curly braces containing other atoms
  var placeholder       = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
      searchPlaceholder = /([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
      compiled = '^', last = 0, m,
      segments = this.segments = [],
      parentParams = parentMatcher ? parentMatcher.params : {},
      params = this.params = parentMatcher ? parentMatcher.params.$$new() : new $$UMFP.ParamSet(),
      paramNames = [];

  function addParameter(id, type, config, location) {
    paramNames.push(id);
    if (parentParams[id]) return parentParams[id];
    if (!/^\w+(-+\w+)*(?:\[\])?$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
    if (params[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
    params[id] = new $$UMFP.Param(id, type, config, location);
    return params[id];
  }

  function quoteRegExp(string, pattern, squash) {
    var surroundPattern = ['',''], result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
    if (!pattern) return result;
    switch(squash) {
      case false: surroundPattern = ['(', ')'];   break;
      case true:  surroundPattern = ['?(', ')?']; break;
      default:    surroundPattern = ['(' + squash + "|", ')?'];  break;
    }
    return result + surroundPattern[0] + pattern + surroundPattern[1];
  }

  this.source = pattern;

  // Split into static segments separated by path parameter placeholders.
  // The number of segments is always 1 more than the number of parameters.
  function matchDetails(m, isSearch) {
    var id, regexp, segment, type, cfg, arrayMode;
    id          = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
    cfg         = config.params[id];
    segment     = pattern.substring(last, m.index);
    regexp      = isSearch ? m[4] : m[4] || (m[1] == '*' ? '.*' : null);
    type        = $$UMFP.type(regexp || "string") || inherit($$UMFP.type("string"), { pattern: new RegExp(regexp) });
    return {
      id: id, regexp: regexp, segment: segment, type: type, cfg: cfg
    };
  }

  var p, param, segment;
  while ((m = placeholder.exec(pattern))) {
    p = matchDetails(m, false);
    if (p.segment.indexOf('?') >= 0) break; // we're into the search part

    param = addParameter(p.id, p.type, p.cfg, "path");
    compiled += quoteRegExp(p.segment, param.type.pattern.source, param.squash);
    segments.push(p.segment);
    last = placeholder.lastIndex;
  }
  segment = pattern.substring(last);

  // Find any search parameter names and remove them from the last segment
  var i = segment.indexOf('?');

  if (i >= 0) {
    var search = this.sourceSearch = segment.substring(i);
    segment = segment.substring(0, i);
    this.sourcePath = pattern.substring(0, last + i);

    if (search.length > 0) {
      last = 0;
      while ((m = searchPlaceholder.exec(search))) {
        p = matchDetails(m, true);
        param = addParameter(p.id, p.type, p.cfg, "search");
        last = placeholder.lastIndex;
        // check if ?&
      }
    }
  } else {
    this.sourcePath = pattern;
    this.sourceSearch = '';
  }

  compiled += quoteRegExp(segment) + (config.strict === false ? '\/?' : '') + '$';
  segments.push(segment);

  this.regexp = new RegExp(compiled, config.caseInsensitive ? 'i' : undefined);
  this.prefix = segments[0];
  this.$$paramNames = paramNames;
}

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#concat
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns a new matcher for a pattern constructed by appending the path part and adding the
 * search parameters of the specified pattern to this pattern. The current pattern is not
 * modified. This can be understood as creating a pattern for URLs that are relative to (or
 * suffixes of) the current pattern.
 *
 * @example
 * The following two matchers are equivalent:
 * <pre>
 * new UrlMatcher('/user/{id}?q').concat('/details?date');
 * new UrlMatcher('/user/{id}/details?q&date');
 * </pre>
 *
 * @param {string} pattern  The pattern to append.
 * @param {Object} config  An object hash of the configuration for the matcher.
 * @returns {UrlMatcher}  A matcher for the concatenated pattern.
 */
UrlMatcher.prototype.concat = function (pattern, config) {
  // Because order of search parameters is irrelevant, we can add our own search
  // parameters to the end of the new pattern. Parse the new pattern by itself
  // and then join the bits together, but it's much easier to do this on a string level.
  var defaultConfig = {
    caseInsensitive: $$UMFP.caseInsensitive(),
    strict: $$UMFP.strictMode(),
    squash: $$UMFP.defaultSquashPolicy()
  };
  return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch, extend(defaultConfig, config), this);
};

UrlMatcher.prototype.toString = function () {
  return this.source;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#exec
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Tests the specified path against this matcher, and returns an object containing the captured
 * parameter values, or null if the path does not match. The returned object contains the values
 * of any search parameters that are mentioned in the pattern, but their value may be null if
 * they are not present in `searchParams`. This means that search parameters are always treated
 * as optional.
 *
 * @example
 * <pre>
 * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', {
 *   x: '1', q: 'hello'
 * });
 * // returns { id: 'bob', q: 'hello', r: null }
 * </pre>
 *
 * @param {string} path  The URL path to match, e.g. `$location.path()`.
 * @param {Object} searchParams  URL search parameters, e.g. `$location.search()`.
 * @returns {Object}  The captured parameter values.
 */
UrlMatcher.prototype.exec = function (path, searchParams) {
  var m = this.regexp.exec(path);
  if (!m) return null;
  searchParams = searchParams || {};

  var paramNames = this.parameters(), nTotal = paramNames.length,
    nPath = this.segments.length - 1,
    values = {}, i, j, cfg, paramName;

  if (nPath !== m.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");

  function decodePathArray(string) {
    function reverseString(str) { return str.split("").reverse().join(""); }
    function unquoteDashes(str) { return str.replace(/\\-/, "-"); }

    var split = reverseString(string).split(/-(?!\\)/);
    var allReversed = map(split, reverseString);
    return map(allReversed, unquoteDashes).reverse();
  }

  for (i = 0; i < nPath; i++) {
    paramName = paramNames[i];
    var param = this.params[paramName];
    var paramVal = m[i+1];
    // if the param value matches a pre-replace pair, replace the value before decoding.
    for (j = 0; j < param.replace; j++) {
      if (param.replace[j].from === paramVal) paramVal = param.replace[j].to;
    }
    if (paramVal && param.array === true) paramVal = decodePathArray(paramVal);
    values[paramName] = param.value(paramVal);
  }
  for (/**/; i < nTotal; i++) {
    paramName = paramNames[i];
    values[paramName] = this.params[paramName].value(searchParams[paramName]);
  }

  return values;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#parameters
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns the names of all path and search parameters of this pattern in an unspecified order.
 * 
 * @returns {Array.<string>}  An array of parameter names. Must be treated as read-only. If the
 *    pattern has no parameters, an empty array is returned.
 */
UrlMatcher.prototype.parameters = function (param) {
  if (!isDefined(param)) return this.$$paramNames;
  return this.params[param] || null;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#validate
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Checks an object hash of parameters to validate their correctness according to the parameter
 * types of this `UrlMatcher`.
 *
 * @param {Object} params The object hash of parameters to validate.
 * @returns {boolean} Returns `true` if `params` validates, otherwise `false`.
 */
UrlMatcher.prototype.validates = function (params) {
  return this.params.$$validates(params);
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#format
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Creates a URL that matches this pattern by substituting the specified values
 * for the path and search parameters. Null values for path parameters are
 * treated as empty strings.
 *
 * @example
 * <pre>
 * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
 * // returns '/user/bob?q=yes'
 * </pre>
 *
 * @param {Object} values  the values to substitute for the parameters in this pattern.
 * @returns {string}  the formatted URL (path and optionally search part).
 */
UrlMatcher.prototype.format = function (values) {
  values = values || {};
  var segments = this.segments, params = this.parameters(), paramset = this.params;
  if (!this.validates(values)) return null;

  var i, search = false, nPath = segments.length - 1, nTotal = params.length, result = segments[0];

  function encodeDashes(str) { // Replace dashes with encoded "\-"
    return encodeURIComponent(str).replace(/-/g, function(c) { return '%5C%' + c.charCodeAt(0).toString(16).toUpperCase(); });
  }

  for (i = 0; i < nTotal; i++) {
    var isPathParam = i < nPath;
    var name = params[i], param = paramset[name], value = param.value(values[name]);
    var isDefaultValue = param.isOptional && param.type.equals(param.value(), value);
    var squash = isDefaultValue ? param.squash : false;
    var encoded = param.type.encode(value);

    if (isPathParam) {
      var nextSegment = segments[i + 1];
      if (squash === false) {
        if (encoded != null) {
          if (isArray(encoded)) {
            result += map(encoded, encodeDashes).join("-");
          } else {
            result += encodeURIComponent(encoded);
          }
        }
        result += nextSegment;
      } else if (squash === true) {
        var capture = result.match(/\/$/) ? /\/?(.*)/ : /(.*)/;
        result += nextSegment.match(capture)[1];
      } else if (isString(squash)) {
        result += squash + nextSegment;
      }
    } else {
      if (encoded == null || (isDefaultValue && squash !== false)) continue;
      if (!isArray(encoded)) encoded = [ encoded ];
      encoded = map(encoded, encodeURIComponent).join('&' + name + '=');
      result += (search ? '&' : '?') + (name + '=' + encoded);
      search = true;
    }
  }

  return result;
};

/**
 * @ngdoc object
 * @name ui.router.util.type:Type
 *
 * @description
 * Implements an interface to define custom parameter types that can be decoded from and encoded to
 * string parameters matched in a URL. Used by {@link ui.router.util.type:UrlMatcher `UrlMatcher`}
 * objects when matching or formatting URLs, or comparing or validating parameter values.
 *
 * See {@link ui.router.util.$urlMatcherFactory#methods_type `$urlMatcherFactory#type()`} for more
 * information on registering custom types.
 *
 * @param {Object} config  A configuration object which contains the custom type definition.  The object's
 *        properties will override the default methods and/or pattern in `Type`'s public interface.
 * @example
 * <pre>
 * {
 *   decode: function(val) { return parseInt(val, 10); },
 *   encode: function(val) { return val && val.toString(); },
 *   equals: function(a, b) { return this.is(a) && a === b; },
 *   is: function(val) { return angular.isNumber(val) isFinite(val) && val % 1 === 0; },
 *   pattern: /\d+/
 * }
 * </pre>
 *
 * @property {RegExp} pattern The regular expression pattern used to match values of this type when
 *           coming from a substring of a URL.
 *
 * @returns {Object}  Returns a new `Type` object.
 */
function Type(config) {
  extend(this, config);
}

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#is
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Detects whether a value is of a particular type. Accepts a native (decoded) value
 * and determines whether it matches the current `Type` object.
 *
 * @param {*} val  The value to check.
 * @param {string} key  Optional. If the type check is happening in the context of a specific
 *        {@link ui.router.util.type:UrlMatcher `UrlMatcher`} object, this is the name of the
 *        parameter in which `val` is stored. Can be used for meta-programming of `Type` objects.
 * @returns {Boolean}  Returns `true` if the value matches the type, otherwise `false`.
 */
Type.prototype.is = function(val, key) {
  return true;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#encode
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Encodes a custom/native type value to a string that can be embedded in a URL. Note that the
 * return value does *not* need to be URL-safe (i.e. passed through `encodeURIComponent()`), it
 * only needs to be a representation of `val` that has been coerced to a string.
 *
 * @param {*} val  The value to encode.
 * @param {string} key  The name of the parameter in which `val` is stored. Can be used for
 *        meta-programming of `Type` objects.
 * @returns {string}  Returns a string representation of `val` that can be encoded in a URL.
 */
Type.prototype.encode = function(val, key) {
  return val;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#decode
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Converts a parameter value (from URL string or transition param) to a custom/native value.
 *
 * @param {string} val  The URL parameter value to decode.
 * @param {string} key  The name of the parameter in which `val` is stored. Can be used for
 *        meta-programming of `Type` objects.
 * @returns {*}  Returns a custom representation of the URL parameter value.
 */
Type.prototype.decode = function(val, key) {
  return val;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:Type#equals
 * @methodOf ui.router.util.type:Type
 *
 * @description
 * Determines whether two decoded values are equivalent.
 *
 * @param {*} a  A value to compare against.
 * @param {*} b  A value to compare against.
 * @returns {Boolean}  Returns `true` if the values are equivalent/equal, otherwise `false`.
 */
Type.prototype.equals = function(a, b) {
  return a == b;
};

Type.prototype.$subPattern = function() {
  var sub = this.pattern.toString();
  return sub.substr(1, sub.length - 2);
};

Type.prototype.pattern = /.*/;

Type.prototype.toString = function() { return "{Type:" + this.name + "}"; };

/*
 * Wraps an existing custom Type as an array of Type, depending on 'mode'.
 * e.g.:
 * - urlmatcher pattern "/path?{queryParam[]:int}"
 * - url: "/path?queryParam=1&queryParam=2
 * - $stateParams.queryParam will be [1, 2]
 * if `mode` is "auto", then
 * - url: "/path?queryParam=1 will create $stateParams.queryParam: 1
 * - url: "/path?queryParam=1&queryParam=2 will create $stateParams.queryParam: [1, 2]
 */
Type.prototype.$asArray = function(mode, isSearch) {
  if (!mode) return this;
  if (mode === "auto" && !isSearch) throw new Error("'auto' array mode is for query parameters only");
  return new ArrayType(this, mode);

  function ArrayType(type, mode) {
    function bindTo(type, callbackName) {
      return function() {
        return type[callbackName].apply(type, arguments);
      };
    }

    // Wrap non-array value as array
    function arrayWrap(val) { return isArray(val) ? val : (isDefined(val) ? [ val ] : []); }
    // Unwrap array value for "auto" mode. Return undefined for empty array.
    function arrayUnwrap(val) {
      switch(val.length) {
        case 0: return undefined;
        case 1: return mode === "auto" ? val[0] : val;
        default: return val;
      }
    }
    function falsey(val) { return !val; }

    // Wraps type (.is/.encode/.decode) functions to operate on each value of an array
    function arrayHandler(callback, allTruthyMode) {
      return function handleArray(val) {
        val = arrayWrap(val);
        var result = map(val, callback);
        if (allTruthyMode === true)
          return filter(result, falsey).length === 0;
        return arrayUnwrap(result);
      };
    }

    // Wraps type (.equals) functions to operate on each value of an array
    function arrayEqualsHandler(callback) {
      return function handleArray(val1, val2) {
        var left = arrayWrap(val1), right = arrayWrap(val2);
        if (left.length !== right.length) return false;
        for (var i = 0; i < left.length; i++) {
          if (!callback(left[i], right[i])) return false;
        }
        return true;
      };
    }

    this.encode = arrayHandler(bindTo(type, 'encode'));
    this.decode = arrayHandler(bindTo(type, 'decode'));
    this.is     = arrayHandler(bindTo(type, 'is'), true);
    this.equals = arrayEqualsHandler(bindTo(type, 'equals'));
    this.pattern = type.pattern;
    this.$arrayMode = mode;
  }
};



/**
 * @ngdoc object
 * @name ui.router.util.$urlMatcherFactory
 *
 * @description
 * Factory for {@link ui.router.util.type:UrlMatcher `UrlMatcher`} instances. The factory
 * is also available to providers under the name `$urlMatcherFactoryProvider`.
 */
function $UrlMatcherFactory() {
  $$UMFP = this;

  var isCaseInsensitive = false, isStrictMode = true, defaultSquashPolicy = false;

  function valToString(val) { return val != null ? val.toString().replace(/\//g, "%2F") : val; }
  function valFromString(val) { return val != null ? val.toString().replace(/%2F/g, "/") : val; }
//  TODO: in 1.0, make string .is() return false if value is undefined by default.
//  function regexpMatches(val) { /*jshint validthis:true */ return isDefined(val) && this.pattern.test(val); }
  function regexpMatches(val) { /*jshint validthis:true */ return this.pattern.test(val); }

  var $types = {}, enqueue = true, typeQueue = [], injector, defaultTypes = {
    string: {
      encode: valToString,
      decode: valFromString,
      is: regexpMatches,
      pattern: /[^/]*/
    },
    int: {
      encode: valToString,
      decode: function(val) { return parseInt(val, 10); },
      is: function(val) { return isDefined(val) && this.decode(val.toString()) === val; },
      pattern: /\d+/
    },
    bool: {
      encode: function(val) { return val ? 1 : 0; },
      decode: function(val) { return parseInt(val, 10) !== 0; },
      is: function(val) { return val === true || val === false; },
      pattern: /0|1/
    },
    date: {
      encode: function (val) {
        if (!this.is(val))
          return undefined;
        return [ val.getFullYear(),
          ('0' + (val.getMonth() + 1)).slice(-2),
          ('0' + val.getDate()).slice(-2)
        ].join("-");
      },
      decode: function (val) {
        if (this.is(val)) return val;
        var match = this.capture.exec(val);
        return match ? new Date(match[1], match[2] - 1, match[3]) : undefined;
      },
      is: function(val) { return val instanceof Date && !isNaN(val.valueOf()); },
      equals: function (a, b) { return this.is(a) && this.is(b) && a.toISOString() === b.toISOString(); },
      pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
      capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
    },
    json: {
      encode: angular.toJson,
      decode: angular.fromJson,
      is: angular.isObject,
      equals: angular.equals,
      pattern: /[^/]*/
    },
    any: { // does not encode/decode
      encode: angular.identity,
      decode: angular.identity,
      is: angular.identity,
      equals: angular.equals,
      pattern: /.*/
    }
  };

  function getDefaultConfig() {
    return {
      strict: isStrictMode,
      caseInsensitive: isCaseInsensitive
    };
  }

  function isInjectable(value) {
    return (isFunction(value) || (isArray(value) && isFunction(value[value.length - 1])));
  }

  /**
   * [Internal] Get the default value of a parameter, which may be an injectable function.
   */
  $UrlMatcherFactory.$$getDefaultValue = function(config) {
    if (!isInjectable(config.value)) return config.value;
    if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
    return injector.invoke(config.value);
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#caseInsensitive
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Defines whether URL matching should be case sensitive (the default behavior), or not.
   *
   * @param {boolean} value `false` to match URL in a case sensitive manner; otherwise `true`;
   * @returns {boolean} the current value of caseInsensitive
   */
  this.caseInsensitive = function(value) {
    if (isDefined(value))
      isCaseInsensitive = value;
    return isCaseInsensitive;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#strictMode
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Defines whether URLs should match trailing slashes, or not (the default behavior).
   *
   * @param {boolean=} value `false` to match trailing slashes in URLs, otherwise `true`.
   * @returns {boolean} the current value of strictMode
   */
  this.strictMode = function(value) {
    if (isDefined(value))
      isStrictMode = value;
    return isStrictMode;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#defaultSquashPolicy
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Sets the default behavior when generating or matching URLs with default parameter values.
   *
   * @param {string} value A string that defines the default parameter URL squashing behavior.
   *    `nosquash`: When generating an href with a default parameter value, do not squash the parameter value from the URL
   *    `slash`: When generating an href with a default parameter value, squash (remove) the parameter value, and, if the
   *             parameter is surrounded by slashes, squash (remove) one slash from the URL
   *    any other string, e.g. "~": When generating an href with a default parameter value, squash (remove)
   *             the parameter value from the URL and replace it with this string.
   */
  this.defaultSquashPolicy = function(value) {
    if (!isDefined(value)) return defaultSquashPolicy;
    if (value !== true && value !== false && !isString(value))
      throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
    defaultSquashPolicy = value;
    return value;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#compile
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Creates a {@link ui.router.util.type:UrlMatcher `UrlMatcher`} for the specified pattern.
   *
   * @param {string} pattern  The URL pattern.
   * @param {Object} config  The config object hash.
   * @returns {UrlMatcher}  The UrlMatcher.
   */
  this.compile = function (pattern, config) {
    return new UrlMatcher(pattern, extend(getDefaultConfig(), config));
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#isMatcher
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Returns true if the specified object is a `UrlMatcher`, or false otherwise.
   *
   * @param {Object} object  The object to perform the type check against.
   * @returns {Boolean}  Returns `true` if the object matches the `UrlMatcher` interface, by
   *          implementing all the same methods.
   */
  this.isMatcher = function (o) {
    if (!isObject(o)) return false;
    var result = true;

    forEach(UrlMatcher.prototype, function(val, name) {
      if (isFunction(val)) {
        result = result && (isDefined(o[name]) && isFunction(o[name]));
      }
    });
    return result;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#type
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Registers a custom {@link ui.router.util.type:Type `Type`} object that can be used to
   * generate URLs with typed parameters.
   *
   * @param {string} name  The type name.
   * @param {Object|Function} definition   The type definition. See
   *        {@link ui.router.util.type:Type `Type`} for information on the values accepted.
   * @param {Object|Function} definitionFn (optional) A function that is injected before the app
   *        runtime starts.  The result of this function is merged into the existing `definition`.
   *        See {@link ui.router.util.type:Type `Type`} for information on the values accepted.
   *
   * @returns {Object}  Returns `$urlMatcherFactoryProvider`.
   *
   * @example
   * This is a simple example of a custom type that encodes and decodes items from an
   * array, using the array index as the URL-encoded value:
   *
   * <pre>
   * var list = ['John', 'Paul', 'George', 'Ringo'];
   *
   * $urlMatcherFactoryProvider.type('listItem', {
   *   encode: function(item) {
   *     // Represent the list item in the URL using its corresponding index
   *     return list.indexOf(item);
   *   },
   *   decode: function(item) {
   *     // Look up the list item by index
   *     return list[parseInt(item, 10)];
   *   },
   *   is: function(item) {
   *     // Ensure the item is valid by checking to see that it appears
   *     // in the list
   *     return list.indexOf(item) > -1;
   *   }
   * });
   *
   * $stateProvider.state('list', {
   *   url: "/list/{item:listItem}",
   *   controller: function($scope, $stateParams) {
   *     console.log($stateParams.item);
   *   }
   * });
   *
   * // ...
   *
   * // Changes URL to '/list/3', logs "Ringo" to the console
   * $state.go('list', { item: "Ringo" });
   * </pre>
   *
   * This is a more complex example of a type that relies on dependency injection to
   * interact with services, and uses the parameter name from the URL to infer how to
   * handle encoding and decoding parameter values:
   *
   * <pre>
   * // Defines a custom type that gets a value from a service,
   * // where each service gets different types of values from
   * // a backend API:
   * $urlMatcherFactoryProvider.type('dbObject', {}, function(Users, Posts) {
   *
   *   // Matches up services to URL parameter names
   *   var services = {
   *     user: Users,
   *     post: Posts
   *   };
   *
   *   return {
   *     encode: function(object) {
   *       // Represent the object in the URL using its unique ID
   *       return object.id;
   *     },
   *     decode: function(value, key) {
   *       // Look up the object by ID, using the parameter
   *       // name (key) to call the correct service
   *       return services[key].findById(value);
   *     },
   *     is: function(object, key) {
   *       // Check that object is a valid dbObject
   *       return angular.isObject(object) && object.id && services[key];
   *     }
   *     equals: function(a, b) {
   *       // Check the equality of decoded objects by comparing
   *       // their unique IDs
   *       return a.id === b.id;
   *     }
   *   };
   * });
   *
   * // In a config() block, you can then attach URLs with
   * // type-annotated parameters:
   * $stateProvider.state('users', {
   *   url: "/users",
   *   // ...
   * }).state('users.item', {
   *   url: "/{user:dbObject}",
   *   controller: function($scope, $stateParams) {
   *     // $stateParams.user will now be an object returned from
   *     // the Users service
   *   },
   *   // ...
   * });
   * </pre>
   */
  this.type = function (name, definition, definitionFn) {
    if (!isDefined(definition)) return $types[name];
    if ($types.hasOwnProperty(name)) throw new Error("A type named '" + name + "' has already been defined.");

    $types[name] = new Type(extend({ name: name }, definition));
    if (definitionFn) {
      typeQueue.push({ name: name, def: definitionFn });
      if (!enqueue) flushTypeQueue();
    }
    return this;
  };

  // `flushTypeQueue()` waits until `$urlMatcherFactory` is injected before invoking the queued `definitionFn`s
  function flushTypeQueue() {
    while(typeQueue.length) {
      var type = typeQueue.shift();
      if (type.pattern) throw new Error("You cannot override a type's .pattern at runtime.");
      angular.extend($types[type.name], injector.invoke(type.def));
    }
  }

  // Register default types. Store them in the prototype of $types.
  forEach(defaultTypes, function(type, name) { $types[name] = new Type(extend({name: name}, type)); });
  $types = inherit($types, {});

  /* No need to document $get, since it returns this */
  this.$get = ['$injector', function ($injector) {
    injector = $injector;
    enqueue = false;
    flushTypeQueue();

    forEach(defaultTypes, function(type, name) {
      if (!$types[name]) $types[name] = new Type(type);
    });
    return this;
  }];

  this.Param = function Param(id, type, config, location) {
    var self = this;
    config = unwrapShorthand(config);
    type = getType(config, type, location);
    var arrayMode = getArrayMode();
    type = arrayMode ? type.$asArray(arrayMode, location === "search") : type;
    if (type.name === "string" && !arrayMode && location === "path" && config.value === undefined)
      config.value = ""; // for 0.2.x; in 0.3.0+ do not automatically default to ""
    var isOptional = config.value !== undefined;
    var squash = getSquashPolicy(config, isOptional);
    var replace = getReplace(config, arrayMode, isOptional, squash);

    function unwrapShorthand(config) {
      var keys = isObject(config) ? objectKeys(config) : [];
      var isShorthand = indexOf(keys, "value") === -1 && indexOf(keys, "type") === -1 &&
                        indexOf(keys, "squash") === -1 && indexOf(keys, "array") === -1;
      if (isShorthand) config = { value: config };
      config.$$fn = isInjectable(config.value) ? config.value : function () { return config.value; };
      return config;
    }

    function getType(config, urlType, location) {
      if (config.type && urlType) throw new Error("Param '"+id+"' has two type configurations.");
      if (urlType) return urlType;
      if (!config.type) return (location === "config" ? $types.any : $types.string);
      return config.type instanceof Type ? config.type : new Type(config.type);
    }

    // array config: param name (param[]) overrides default settings.  explicit config overrides param name.
    function getArrayMode() {
      var arrayDefaults = { array: (location === "search" ? "auto" : false) };
      var arrayParamNomenclature = id.match(/\[\]$/) ? { array: true } : {};
      return extend(arrayDefaults, arrayParamNomenclature, config).array;
    }

    /**
     * returns false, true, or the squash value to indicate the "default parameter url squash policy".
     */
    function getSquashPolicy(config, isOptional) {
      var squash = config.squash;
      if (!isOptional || squash === false) return false;
      if (!isDefined(squash) || squash == null) return defaultSquashPolicy;
      if (squash === true || isString(squash)) return squash;
      throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string");
    }

    function getReplace(config, arrayMode, isOptional, squash) {
      var replace, configuredKeys, defaultPolicy = [
        { from: "",   to: (isOptional || arrayMode ? undefined : "") },
        { from: null, to: (isOptional || arrayMode ? undefined : "") }
      ];
      replace = isArray(config.replace) ? config.replace : [];
      if (isString(squash))
        replace.push({ from: squash, to: undefined });
      configuredKeys = map(replace, function(item) { return item.from; } );
      return filter(defaultPolicy, function(item) { return indexOf(configuredKeys, item.from) === -1; }).concat(replace);
    }

    /**
     * [Internal] Get the default value of a parameter, which may be an injectable function.
     */
    function $$getDefaultValue() {
      if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
      return injector.invoke(config.$$fn);
    }

    /**
     * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
     * default value, which may be the result of an injectable function.
     */
    function $value(value) {
      function hasReplaceVal(val) { return function(obj) { return obj.from === val; }; }
      function $replace(value) {
        var replacement = map(filter(self.replace, hasReplaceVal(value)), function(obj) { return obj.to; });
        return replacement.length ? replacement[0] : value;
      }
      value = $replace(value);
      return isDefined(value) ? self.type.decode(value) : $$getDefaultValue();
    }

    function toString() { return "{Param:" + id + " " + type + " squash: '" + squash + "' optional: " + isOptional + "}"; }

    extend(this, {
      id: id,
      type: type,
      location: location,
      array: arrayMode,
      squash: squash,
      replace: replace,
      isOptional: isOptional,
      value: $value,
      dynamic: undefined,
      config: config,
      toString: toString
    });
  };

  function ParamSet(params) {
    extend(this, params || {});
  }

  ParamSet.prototype = {
    $$new: function() {
      return inherit(this, extend(new ParamSet(), { $$parent: this}));
    },
    $$keys: function () {
      var keys = [], chain = [], parent = this,
        ignore = objectKeys(ParamSet.prototype);
      while (parent) { chain.push(parent); parent = parent.$$parent; }
      chain.reverse();
      forEach(chain, function(paramset) {
        forEach(objectKeys(paramset), function(key) {
            if (indexOf(keys, key) === -1 && indexOf(ignore, key) === -1) keys.push(key);
        });
      });
      return keys;
    },
    $$values: function(paramValues) {
      var values = {}, self = this;
      forEach(self.$$keys(), function(key) {
        values[key] = self[key].value(paramValues && paramValues[key]);
      });
      return values;
    },
    $$equals: function(paramValues1, paramValues2) {
      var equal = true, self = this;
      forEach(self.$$keys(), function(key) {
        var left = paramValues1 && paramValues1[key], right = paramValues2 && paramValues2[key];
        if (!self[key].type.equals(left, right)) equal = false;
      });
      return equal;
    },
    $$validates: function $$validate(paramValues) {
      var result = true, isOptional, val, param, self = this;

      forEach(this.$$keys(), function(key) {
        param = self[key];
        val = paramValues[key];
        isOptional = !val && param.isOptional;
        result = result && (isOptional || !!param.type.is(val));
      });
      return result;
    },
    $$parent: undefined
  };

  this.ParamSet = ParamSet;
}

// Register as a provider so it's available to other providers
angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);
angular.module('ui.router.util').run(['$urlMatcherFactory', function($urlMatcherFactory) { }]);

/**
 * @ngdoc object
 * @name ui.router.router.$urlRouterProvider
 *
 * @requires ui.router.util.$urlMatcherFactoryProvider
 * @requires $locationProvider
 *
 * @description
 * `$urlRouterProvider` has the responsibility of watching `$location`. 
 * When `$location` changes it runs through a list of rules one by one until a 
 * match is found. `$urlRouterProvider` is used behind the scenes anytime you specify 
 * a url in a state configuration. All urls are compiled into a UrlMatcher object.
 *
 * There are several methods on `$urlRouterProvider` that make it useful to use directly
 * in your module config.
 */
$UrlRouterProvider.$inject = ['$locationProvider', '$urlMatcherFactoryProvider'];
function $UrlRouterProvider(   $locationProvider,   $urlMatcherFactory) {
  var rules = [], otherwise = null, interceptDeferred = false, listener;

  // Returns a string that is a prefix of all strings matching the RegExp
  function regExpPrefix(re) {
    var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
    return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
  }

  // Interpolates matched values into a String.replace()-style pattern
  function interpolate(pattern, match) {
    return pattern.replace(/\$(\$|\d{1,2})/, function (m, what) {
      return match[what === '$' ? 0 : Number(what)];
    });
  }

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#rule
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines rules that are used by `$urlRouterProvider` to find matches for
   * specific URLs.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // Here's an example of how you might allow case insensitive urls
   *   $urlRouterProvider.rule(function ($injector, $location) {
   *     var path = $location.path(),
   *         normalized = path.toLowerCase();
   *
   *     if (path !== normalized) {
   *       return normalized;
   *     }
   *   });
   * });
   * </pre>
   *
   * @param {object} rule Handler function that takes `$injector` and `$location`
   * services as arguments. You can use them to return a valid path as a string.
   *
   * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
   */
  this.rule = function (rule) {
    if (!isFunction(rule)) throw new Error("'rule' must be a function");
    rules.push(rule);
    return this;
  };

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouterProvider#otherwise
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines a path that is used when an invalid route is requested.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // if the path doesn't match any of the urls you configured
   *   // otherwise will take care of routing the user to the
   *   // specified url
   *   $urlRouterProvider.otherwise('/index');
   *
   *   // Example of using function rule as param
   *   $urlRouterProvider.otherwise(function ($injector, $location) {
   *     return '/a/valid/url';
   *   });
   * });
   * </pre>
   *
   * @param {string|object} rule The url path you want to redirect to or a function 
   * rule that returns the url path. The function version is passed two params: 
   * `$injector` and `$location` services, and must return a url string.
   *
   * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
   */
  this.otherwise = function (rule) {
    if (isString(rule)) {
      var redirect = rule;
      rule = function () { return redirect; };
    }
    else if (!isFunction(rule)) throw new Error("'rule' must be a function");
    otherwise = rule;
    return this;
  };


  function handleIfMatch($injector, handler, match) {
    if (!match) return false;
    var result = $injector.invoke(handler, handler, { $match: match });
    return isDefined(result) ? result : true;
  }

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#when
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Registers a handler for a given url matching. if handle is a string, it is
   * treated as a redirect, and is interpolated according to the syntax of match
   * (i.e. like `String.replace()` for `RegExp`, or like a `UrlMatcher` pattern otherwise).
   *
   * If the handler is a function, it is injectable. It gets invoked if `$location`
   * matches. You have the option of inject the match object as `$match`.
   *
   * The handler can return
   *
   * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
   *   will continue trying to find another one that matches.
   * - **string** which is treated as a redirect and passed to `$location.url()`
   * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
   *     if ($state.$current.navigable !== state ||
   *         !equalForKeys($match, $stateParams) {
   *      $state.transitionTo(state, $match, false);
   *     }
   *   });
   * });
   * </pre>
   *
   * @param {string|object} what The incoming path that you want to redirect.
   * @param {string|object} handler The path you want to redirect your user to.
   */
  this.when = function (what, handler) {
    var redirect, handlerIsString = isString(handler);
    if (isString(what)) what = $urlMatcherFactory.compile(what);

    if (!handlerIsString && !isFunction(handler) && !isArray(handler))
      throw new Error("invalid 'handler' in when()");

    var strategies = {
      matcher: function (what, handler) {
        if (handlerIsString) {
          redirect = $urlMatcherFactory.compile(handler);
          handler = ['$match', function ($match) { return redirect.format($match); }];
        }
        return extend(function ($injector, $location) {
          return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
        }, {
          prefix: isString(what.prefix) ? what.prefix : ''
        });
      },
      regex: function (what, handler) {
        if (what.global || what.sticky) throw new Error("when() RegExp must not be global or sticky");

        if (handlerIsString) {
          redirect = handler;
          handler = ['$match', function ($match) { return interpolate(redirect, $match); }];
        }
        return extend(function ($injector, $location) {
          return handleIfMatch($injector, handler, what.exec($location.path()));
        }, {
          prefix: regExpPrefix(what)
        });
      }
    };

    var check = { matcher: $urlMatcherFactory.isMatcher(what), regex: what instanceof RegExp };

    for (var n in check) {
      if (check[n]) return this.rule(strategies[n](what, handler));
    }

    throw new Error("invalid 'what' in when()");
  };

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#deferIntercept
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Disables (or enables) deferring location change interception.
   *
   * If you wish to customize the behavior of syncing the URL (for example, if you wish to
   * defer a transition but maintain the current URL), call this method at configuration time.
   * Then, at run time, call `$urlRouter.listen()` after you have configured your own
   * `$locationChangeSuccess` event handler.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *
   *   // Prevent $urlRouter from automatically intercepting URL changes;
   *   // this allows you to configure custom behavior in between
   *   // location changes and route synchronization:
   *   $urlRouterProvider.deferIntercept();
   *
   * }).run(function ($rootScope, $urlRouter, UserService) {
   *
   *   $rootScope.$on('$locationChangeSuccess', function(e) {
   *     // UserService is an example service for managing user state
   *     if (UserService.isLoggedIn()) return;
   *
   *     // Prevent $urlRouter's default handler from firing
   *     e.preventDefault();
   *
   *     UserService.handleLogin().then(function() {
   *       // Once the user has logged in, sync the current URL
   *       // to the router:
   *       $urlRouter.sync();
   *     });
   *   });
   *
   *   // Configures $urlRouter's listener *after* your custom listener
   *   $urlRouter.listen();
   * });
   * </pre>
   *
   * @param {boolean} defer Indicates whether to defer location change interception. Passing
            no parameter is equivalent to `true`.
   */
  this.deferIntercept = function (defer) {
    if (defer === undefined) defer = true;
    interceptDeferred = defer;
  };

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouter
   *
   * @requires $location
   * @requires $rootScope
   * @requires $injector
   * @requires $browser
   *
   * @description
   *
   */
  this.$get = $get;
  $get.$inject = ['$location', '$rootScope', '$injector', '$browser'];
  function $get(   $location,   $rootScope,   $injector,   $browser) {

    var baseHref = $browser.baseHref(), location = $location.url(), lastPushedUrl;

    function appendBasePath(url, isHtml5, absolute) {
      if (baseHref === '/') return url;
      if (isHtml5) return baseHref.slice(0, -1) + url;
      if (absolute) return baseHref.slice(1) + url;
      return url;
    }

    // TODO: Optimize groups of rules with non-empty prefix into some sort of decision tree
    function update(evt) {
      if (evt && evt.defaultPrevented) return;
      var ignoreUpdate = lastPushedUrl && $location.url() === lastPushedUrl;
      lastPushedUrl = undefined;
      if (ignoreUpdate) return true;

      function check(rule) {
        var handled = rule($injector, $location);

        if (!handled) return false;
        if (isString(handled)) $location.replace().url(handled);
        return true;
      }
      var n = rules.length, i;

      for (i = 0; i < n; i++) {
        if (check(rules[i])) return;
      }
      // always check otherwise last to allow dynamic updates to the set of rules
      if (otherwise) check(otherwise);
    }

    function listen() {
      listener = listener || $rootScope.$on('$locationChangeSuccess', update);
      return listener;
    }

    if (!interceptDeferred) listen();

    return {
      /**
       * @ngdoc function
       * @name ui.router.router.$urlRouter#sync
       * @methodOf ui.router.router.$urlRouter
       *
       * @description
       * Triggers an update; the same update that happens when the address bar url changes, aka `$locationChangeSuccess`.
       * This method is useful when you need to use `preventDefault()` on the `$locationChangeSuccess` event,
       * perform some custom logic (route protection, auth, config, redirection, etc) and then finally proceed
       * with the transition by calling `$urlRouter.sync()`.
       *
       * @example
       * <pre>
       * angular.module('app', ['ui.router'])
       *   .run(function($rootScope, $urlRouter) {
       *     $rootScope.$on('$locationChangeSuccess', function(evt) {
       *       // Halt state change from even starting
       *       evt.preventDefault();
       *       // Perform custom logic
       *       var meetsRequirement = ...
       *       // Continue with the update and state transition if logic allows
       *       if (meetsRequirement) $urlRouter.sync();
       *     });
       * });
       * </pre>
       */
      sync: function() {
        update();
      },

      listen: function() {
        return listen();
      },

      update: function(read) {
        if (read) {
          location = $location.url();
          return;
        }
        if ($location.url() === location) return;

        $location.url(location);
        $location.replace();
      },

      push: function(urlMatcher, params, options) {
        $location.url(urlMatcher.format(params || {}));
        lastPushedUrl = options && options.$$avoidResync ? $location.url() : undefined;
        if (options && options.replace) $location.replace();
      },

      /**
       * @ngdoc function
       * @name ui.router.router.$urlRouter#href
       * @methodOf ui.router.router.$urlRouter
       *
       * @description
       * A URL generation method that returns the compiled URL for a given
       * {@link ui.router.util.type:UrlMatcher `UrlMatcher`}, populated with the provided parameters.
       *
       * @example
       * <pre>
       * $bob = $urlRouter.href(new UrlMatcher("/about/:person"), {
       *   person: "bob"
       * });
       * // $bob == "/about/bob";
       * </pre>
       *
       * @param {UrlMatcher} urlMatcher The `UrlMatcher` object which is used as the template of the URL to generate.
       * @param {object=} params An object of parameter values to fill the matcher's required parameters.
       * @param {object=} options Options object. The options are:
       *
       * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
       *
       * @returns {string} Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
       */
      href: function(urlMatcher, params, options) {
        if (!urlMatcher.validates(params)) return null;

        var isHtml5 = $locationProvider.html5Mode();
        if (angular.isObject(isHtml5)) {
          isHtml5 = isHtml5.enabled;
        }
        
        var url = urlMatcher.format(params);
        options = options || {};

        if (!isHtml5 && url !== null) {
          url = "#" + $locationProvider.hashPrefix() + url;
        }
        url = appendBasePath(url, isHtml5, options.absolute);

        if (!options.absolute || !url) {
          return url;
        }

        var slash = (!isHtml5 && url ? '/' : ''), port = $location.port();
        port = (port === 80 || port === 443 ? '' : ':' + port);

        return [$location.protocol(), '://', $location.host(), port, slash, url].join('');
      }
    };
  }
}

angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$stateProvider
 *
 * @requires ui.router.router.$urlRouterProvider
 * @requires ui.router.util.$urlMatcherFactoryProvider
 *
 * @description
 * The new `$stateProvider` works similar to Angular's v1 router, but it focuses purely
 * on state.
 *
 * A state corresponds to a "place" in the application in terms of the overall UI and
 * navigation. A state describes (via the controller / template / view properties) what
 * the UI looks like and does at that place.
 *
 * States often have things in common, and the primary way of factoring out these
 * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
 * nested states.
 *
 * The `$stateProvider` provides interfaces to declare these states for your app.
 */
$StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider'];
function $StateProvider(   $urlRouterProvider,   $urlMatcherFactory) {

  var root, states = {}, $state, queue = {}, abstractKey = 'abstract';

  // Builds state properties from definition passed to registerState()
  var stateBuilder = {

    // Derive parent state from a hierarchical name only if 'parent' is not explicitly defined.
    // state.children = [];
    // if (parent) parent.children.push(state);
    parent: function(state) {
      if (isDefined(state.parent) && state.parent) return findState(state.parent);
      // regex matches any valid composite state name
      // would match "contact.list" but not "contacts"
      var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
      return compositeName ? findState(compositeName[1]) : root;
    },

    // inherit 'data' from parent and override by own values (if any)
    data: function(state) {
      if (state.parent && state.parent.data) {
        state.data = state.self.data = extend({}, state.parent.data, state.data);
      }
      return state.data;
    },

    // Build a URLMatcher if necessary, either via a relative or absolute URL
    url: function(state) {
      var url = state.url, config = { params: state.params || {} };

      if (isString(url)) {
        if (url.charAt(0) == '^') return $urlMatcherFactory.compile(url.substring(1), config);
        return (state.parent.navigable || root).url.concat(url, config);
      }

      if (!url || $urlMatcherFactory.isMatcher(url)) return url;
      throw new Error("Invalid url '" + url + "' in state '" + state + "'");
    },

    // Keep track of the closest ancestor state that has a URL (i.e. is navigable)
    navigable: function(state) {
      return state.url ? state : (state.parent ? state.parent.navigable : null);
    },

    // Own parameters for this state. state.url.params is already built at this point. Create and add non-url params
    ownParams: function(state) {
      var params = state.url && state.url.params || new $$UMFP.ParamSet();
      forEach(state.params || {}, function(config, id) {
        if (!params[id]) params[id] = new $$UMFP.Param(id, null, config, "config");
      });
      return params;
    },

    // Derive parameters for this state and ensure they're a super-set of parent's parameters
    params: function(state) {
      return state.parent && state.parent.params ? extend(state.parent.params.$$new(), state.ownParams) : new $$UMFP.ParamSet();
    },

    // If there is no explicit multi-view configuration, make one up so we don't have
    // to handle both cases in the view directive later. Note that having an explicit
    // 'views' property will mean the default unnamed view properties are ignored. This
    // is also a good time to resolve view names to absolute names, so everything is a
    // straight lookup at link time.
    views: function(state) {
      var views = {};

      forEach(isDefined(state.views) ? state.views : { '': state }, function (view, name) {
        if (name.indexOf('@') < 0) name += '@' + state.parent.name;
        views[name] = view;
      });
      return views;
    },

    // Keep a full path from the root down to this state as this is needed for state activation.
    path: function(state) {
      return state.parent ? state.parent.path.concat(state) : []; // exclude root from path
    },

    // Speed up $state.contains() as it's used a lot
    includes: function(state) {
      var includes = state.parent ? extend({}, state.parent.includes) : {};
      includes[state.name] = true;
      return includes;
    },

    $delegates: {}
  };

  function isRelative(stateName) {
    return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
  }

  function findState(stateOrName, base) {
    if (!stateOrName) return undefined;

    var isStr = isString(stateOrName),
        name  = isStr ? stateOrName : stateOrName.name,
        path  = isRelative(name);

    if (path) {
      if (!base) throw new Error("No reference point given for path '"  + name + "'");
      base = findState(base);
      
      var rel = name.split("."), i = 0, pathLength = rel.length, current = base;

      for (; i < pathLength; i++) {
        if (rel[i] === "" && i === 0) {
          current = base;
          continue;
        }
        if (rel[i] === "^") {
          if (!current.parent) throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
          current = current.parent;
          continue;
        }
        break;
      }
      rel = rel.slice(i).join(".");
      name = current.name + (current.name && rel ? "." : "") + rel;
    }
    var state = states[name];

    if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
      return state;
    }
    return undefined;
  }

  function queueState(parentName, state) {
    if (!queue[parentName]) {
      queue[parentName] = [];
    }
    queue[parentName].push(state);
  }

  function flushQueuedChildren(parentName) {
    var queued = queue[parentName] || [];
    while(queued.length) {
      registerState(queued.shift());
    }
  }

  function registerState(state) {
    // Wrap a new object around the state so we can store our private details easily.
    state = inherit(state, {
      self: state,
      resolve: state.resolve || {},
      toString: function() { return this.name; }
    });

    var name = state.name;
    if (!isString(name) || name.indexOf('@') >= 0) throw new Error("State must have a valid name");
    if (states.hasOwnProperty(name)) throw new Error("State '" + name + "'' is already defined");

    // Get parent name
    var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.'))
        : (isString(state.parent)) ? state.parent
        : (isObject(state.parent) && isString(state.parent.name)) ? state.parent.name
        : '';

    // If parent is not registered yet, add state to queue and register later
    if (parentName && !states[parentName]) {
      return queueState(parentName, state.self);
    }

    for (var key in stateBuilder) {
      if (isFunction(stateBuilder[key])) state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
    }
    states[name] = state;

    // Register the state in the global state list and with $urlRouter if necessary.
    if (!state[abstractKey] && state.url) {
      $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
        if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
          $state.transitionTo(state, $match, { inherit: true, location: false });
        }
      }]);
    }

    // Register any queued children
    flushQueuedChildren(name);

    return state;
  }

  // Checks text to see if it looks like a glob.
  function isGlob (text) {
    return text.indexOf('*') > -1;
  }

  // Returns true if glob matches current $state name.
  function doesStateMatchGlob (glob) {
    var globSegments = glob.split('.'),
        segments = $state.$current.name.split('.');

    //match greedy starts
    if (globSegments[0] === '**') {
       segments = segments.slice(indexOf(segments, globSegments[1]));
       segments.unshift('**');
    }
    //match greedy ends
    if (globSegments[globSegments.length - 1] === '**') {
       segments.splice(indexOf(segments, globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
       segments.push('**');
    }

    if (globSegments.length != segments.length) {
      return false;
    }

    //match single stars
    for (var i = 0, l = globSegments.length; i < l; i++) {
      if (globSegments[i] === '*') {
        segments[i] = '*';
      }
    }

    return segments.join('') === globSegments.join('');
  }


  // Implicit root state that is always active
  root = registerState({
    name: '',
    url: '^',
    views: null,
    'abstract': true
  });
  root.navigable = null;


  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#decorator
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Allows you to extend (carefully) or override (at your own peril) the 
   * `stateBuilder` object used internally by `$stateProvider`. This can be used 
   * to add custom functionality to ui-router, for example inferring templateUrl 
   * based on the state name.
   *
   * When passing only a name, it returns the current (original or decorated) builder
   * function that matches `name`.
   *
   * The builder functions that can be decorated are listed below. Though not all
   * necessarily have a good use case for decoration, that is up to you to decide.
   *
   * In addition, users can attach custom decorators, which will generate new 
   * properties within the state's internal definition. There is currently no clear 
   * use-case for this beyond accessing internal states (i.e. $state.$current), 
   * however, expect this to become increasingly relevant as we introduce additional 
   * meta-programming features.
   *
   * **Warning**: Decorators should not be interdependent because the order of 
   * execution of the builder functions in non-deterministic. Builder functions 
   * should only be dependent on the state definition object and super function.
   *
   *
   * Existing builder functions and current return values:
   *
   * - **parent** `{object}` - returns the parent state object.
   * - **data** `{object}` - returns state data, including any inherited data that is not
   *   overridden by own values (if any).
   * - **url** `{object}` - returns a {@link ui.router.util.type:UrlMatcher UrlMatcher}
   *   or `null`.
   * - **navigable** `{object}` - returns closest ancestor state that has a URL (aka is 
   *   navigable).
   * - **params** `{object}` - returns an array of state params that are ensured to 
   *   be a super-set of parent's params.
   * - **views** `{object}` - returns a views object where each key is an absolute view 
   *   name (i.e. "viewName@stateName") and each value is the config object 
   *   (template, controller) for the view. Even when you don't use the views object 
   *   explicitly on a state config, one is still created for you internally.
   *   So by decorating this builder function you have access to decorating template 
   *   and controller properties.
   * - **ownParams** `{object}` - returns an array of params that belong to the state, 
   *   not including any params defined by ancestor states.
   * - **path** `{string}` - returns the full path from the root down to this state. 
   *   Needed for state activation.
   * - **includes** `{object}` - returns an object that includes every state that 
   *   would pass a `$state.includes()` test.
   *
   * @example
   * <pre>
   * // Override the internal 'views' builder with a function that takes the state
   * // definition, and a reference to the internal function being overridden:
   * $stateProvider.decorator('views', function (state, parent) {
   *   var result = {},
   *       views = parent(state);
   *
   *   angular.forEach(views, function (config, name) {
   *     var autoName = (state.name + '.' + name).replace('.', '/');
   *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
   *     result[name] = config;
   *   });
   *   return result;
   * });
   *
   * $stateProvider.state('home', {
   *   views: {
   *     'contact.list': { controller: 'ListController' },
   *     'contact.item': { controller: 'ItemController' }
   *   }
   * });
   *
   * // ...
   *
   * $state.go('home');
   * // Auto-populates list and item views with /partials/home/contact/list.html,
   * // and /partials/home/contact/item.html, respectively.
   * </pre>
   *
   * @param {string} name The name of the builder function to decorate. 
   * @param {object} func A function that is responsible for decorating the original 
   * builder function. The function receives two parameters:
   *
   *   - `{object}` - state - The state config object.
   *   - `{object}` - super - The original builder function.
   *
   * @return {object} $stateProvider - $stateProvider instance
   */
  this.decorator = decorator;
  function decorator(name, func) {
    /*jshint validthis: true */
    if (isString(name) && !isDefined(func)) {
      return stateBuilder[name];
    }
    if (!isFunction(func) || !isString(name)) {
      return this;
    }
    if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
      stateBuilder.$delegates[name] = stateBuilder[name];
    }
    stateBuilder[name] = func;
    return this;
  }

  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#state
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Registers a state configuration under a given state name. The stateConfig object
   * has the following acceptable properties.
   *
   * @param {string} name A unique state name, e.g. "home", "about", "contacts".
   * To create a parent/child state use a dot, e.g. "about.sales", "home.newest".
   * @param {object} stateConfig State configuration object.
   * @param {string|function=} stateConfig.template
   * <a id='template'></a>
   *   html template as a string or a function that returns
   *   an html template as a string which should be used by the uiView directives. This property 
   *   takes precedence over templateUrl.
   *   
   *   If `template` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by
   *     applying the current state
   *
   * <pre>template:
   *   "<h1>inline template definition</h1>" +
   *   "<div ui-view></div>"</pre>
   * <pre>template: function(params) {
   *       return "<h1>generated template</h1>"; }</pre>
   * </div>
   *
   * @param {string|function=} stateConfig.templateUrl
   * <a id='templateUrl'></a>
   *
   *   path or function that returns a path to an html
   *   template that should be used by uiView.
   *   
   *   If `templateUrl` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by 
   *     applying the current state
   *
   * <pre>templateUrl: "home.html"</pre>
   * <pre>templateUrl: function(params) {
   *     return myTemplates[params.pageId]; }</pre>
   *
   * @param {function=} stateConfig.templateProvider
   * <a id='templateProvider'></a>
   *    Provider function that returns HTML content string.
   * <pre> templateProvider:
   *       function(MyTemplateService, params) {
   *         return MyTemplateService.getTemplate(params.pageId);
   *       }</pre>
   *
   * @param {string|function=} stateConfig.controller
   * <a id='controller'></a>
   *
   *  Controller fn that should be associated with newly
   *   related scope or the name of a registered controller if passed as a string.
   *   Optionally, the ControllerAs may be declared here.
   * <pre>controller: "MyRegisteredController"</pre>
   * <pre>controller:
   *     "MyRegisteredController as fooCtrl"}</pre>
   * <pre>controller: function($scope, MyService) {
   *     $scope.data = MyService.getData(); }</pre>
   *
   * @param {function=} stateConfig.controllerProvider
   * <a id='controllerProvider'></a>
   *
   * Injectable provider function that returns the actual controller or string.
   * <pre>controllerProvider:
   *   function(MyResolveData) {
   *     if (MyResolveData.foo)
   *       return "FooCtrl"
   *     else if (MyResolveData.bar)
   *       return "BarCtrl";
   *     else return function($scope) {
   *       $scope.baz = "Qux";
   *     }
   *   }</pre>
   *
   * @param {string=} stateConfig.controllerAs
   * <a id='controllerAs'></a>
   * 
   * A controller alias name. If present the controller will be
   *   published to scope under the controllerAs name.
   * <pre>controllerAs: "myCtrl"</pre>
   *
   * @param {object=} stateConfig.resolve
   * <a id='resolve'></a>
   *
   * An optional map&lt;string, function&gt; of dependencies which
   *   should be injected into the controller. If any of these dependencies are promises, 
   *   the router will wait for them all to be resolved before the controller is instantiated.
   *   If all the promises are resolved successfully, the $stateChangeSuccess event is fired
   *   and the values of the resolved promises are injected into any controllers that reference them.
   *   If any  of the promises are rejected the $stateChangeError event is fired.
   *
   *   The map object is:
   *   
   *   - key - {string}: name of dependency to be injected into controller
   *   - factory - {string|function}: If string then it is alias for service. Otherwise if function, 
   *     it is injected and return value it treated as dependency. If result is a promise, it is 
   *     resolved before its value is injected into controller.
   *
   * <pre>resolve: {
   *     myResolve1:
   *       function($http, $stateParams) {
   *         return $http.get("/api/foos/"+stateParams.fooID);
   *       }
   *     }</pre>
   *
   * @param {string=} stateConfig.url
   * <a id='url'></a>
   *
   *   A url fragment with optional parameters. When a state is navigated or
   *   transitioned to, the `$stateParams` service will be populated with any 
   *   parameters that were passed.
   *
   * examples:
   * <pre>url: "/home"
   * url: "/users/:userid"
   * url: "/books/{bookid:[a-zA-Z_-]}"
   * url: "/books/{categoryid:int}"
   * url: "/books/{publishername:string}/{categoryid:int}"
   * url: "/messages?before&after"
   * url: "/messages?{before:date}&{after:date}"</pre>
   * url: "/messages/:mailboxid?{before:date}&{after:date}"
   *
   * @param {object=} stateConfig.views
   * <a id='views'></a>
   * an optional map&lt;string, object&gt; which defined multiple views, or targets views
   * manually/explicitly.
   *
   * Examples:
   *
   * Targets three named `ui-view`s in the parent state's template
   * <pre>views: {
   *     header: {
   *       controller: "headerCtrl",
   *       templateUrl: "header.html"
   *     }, body: {
   *       controller: "bodyCtrl",
   *       templateUrl: "body.html"
   *     }, footer: {
   *       controller: "footCtrl",
   *       templateUrl: "footer.html"
   *     }
   *   }</pre>
   *
   * Targets named `ui-view="header"` from grandparent state 'top''s template, and named `ui-view="body" from parent state's template.
   * <pre>views: {
   *     'header@top': {
   *       controller: "msgHeaderCtrl",
   *       templateUrl: "msgHeader.html"
   *     }, 'body': {
   *       controller: "messagesCtrl",
   *       templateUrl: "messages.html"
   *     }
   *   }</pre>
   *
   * @param {boolean=} [stateConfig.abstract=false]
   * <a id='abstract'></a>
   * An abstract state will never be directly activated,
   *   but can provide inherited properties to its common children states.
   * <pre>abstract: true</pre>
   *
   * @param {function=} stateConfig.onEnter
   * <a id='onEnter'></a>
   *
   * Callback function for when a state is entered. Good way
   *   to trigger an action or dispatch an event, such as opening a dialog.
   * If minifying your scripts, make sure to explictly annotate this function,
   * because it won't be automatically annotated by your build tools.
   *
   * <pre>onEnter: function(MyService, $stateParams) {
   *     MyService.foo($stateParams.myParam);
   * }</pre>
   *
   * @param {function=} stateConfig.onExit
   * <a id='onExit'></a>
   *
   * Callback function for when a state is exited. Good way to
   *   trigger an action or dispatch an event, such as opening a dialog.
   * If minifying your scripts, make sure to explictly annotate this function,
   * because it won't be automatically annotated by your build tools.
   *
   * <pre>onExit: function(MyService, $stateParams) {
   *     MyService.cleanup($stateParams.myParam);
   * }</pre>
   *
   * @param {boolean=} [stateConfig.reloadOnSearch=true]
   * <a id='reloadOnSearch'></a>
   *
   * If `false`, will not retrigger the same state
   *   just because a search/query parameter has changed (via $location.search() or $location.hash()). 
   *   Useful for when you'd like to modify $location.search() without triggering a reload.
   * <pre>reloadOnSearch: false</pre>
   *
   * @param {object=} stateConfig.data
   * <a id='data'></a>
   *
   * Arbitrary data object, useful for custom configuration.  The parent state's `data` is
   *   prototypally inherited.  In other words, adding a data property to a state adds it to
   *   the entire subtree via prototypal inheritance.
   *
   * <pre>data: {
   *     requiredRole: 'foo'
   * } </pre>
   *
   * @param {object=} stateConfig.params
   * <a id='params'></a>
   *
   * A map which optionally configures parameters declared in the `url`, or
   *   defines additional non-url parameters.  For each parameter being
   *   configured, add a configuration object keyed to the name of the parameter.
   *
   *   Each parameter configuration object may contain the following properties:
   *
   *   - ** value ** - {object|function=}: specifies the default value for this
   *     parameter.  This implicitly sets this parameter as optional.
   *
   *     When UI-Router routes to a state and no value is
   *     specified for this parameter in the URL or transition, the
   *     default value will be used instead.  If `value` is a function,
   *     it will be injected and invoked, and the return value used.
   *
   *     *Note*: `undefined` is treated as "no default value" while `null`
   *     is treated as "the default value is `null`".
   *
   *     *Shorthand*: If you only need to configure the default value of the
   *     parameter, you may use a shorthand syntax.   In the **`params`**
   *     map, instead mapping the param name to a full parameter configuration
   *     object, simply set map it to the default parameter value, e.g.:
   *
   * <pre>// define a parameter's default value
   * params: {
   *     param1: { value: "defaultValue" }
   * }
   * // shorthand default values
   * params: {
   *     param1: "defaultValue",
   *     param2: "param2Default"
   * }</pre>
   *
   *   - ** array ** - {boolean=}: *(default: false)* If true, the param value will be
   *     treated as an array of values.  If you specified a Type, the value will be
   *     treated as an array of the specified Type.  Note: query parameter values
   *     default to a special `"auto"` mode.
   *
   *     For query parameters in `"auto"` mode, if multiple  values for a single parameter
   *     are present in the URL (e.g.: `/foo?bar=1&bar=2&bar=3`) then the values
   *     are mapped to an array (e.g.: `{ foo: [ '1', '2', '3' ] }`).  However, if
   *     only one value is present (e.g.: `/foo?bar=1`) then the value is treated as single
   *     value (e.g.: `{ foo: '1' }`).
   *
   * <pre>params: {
   *     param1: { array: true }
   * }</pre>
   *
   *   - ** squash ** - {bool|string=}: `squash` configures how a default parameter value is represented in the URL when
   *     the current parameter value is the same as the default value. If `squash` is not set, it uses the
   *     configured default squash policy.
   *     (See {@link ui.router.util.$urlMatcherFactory#methods_defaultSquashPolicy `defaultSquashPolicy()`})
   *
   *   There are three squash settings:
   *
   *     - false: The parameter's default value is not squashed.  It is encoded and included in the URL
   *     - true: The parameter's default value is omitted from the URL.  If the parameter is preceeded and followed
   *       by slashes in the state's `url` declaration, then one of those slashes are omitted.
   *       This can allow for cleaner looking URLs.
   *     - `"<arbitrary string>"`: The parameter's default value is replaced with an arbitrary placeholder of  your choice.
   *
   * <pre>params: {
   *     param1: {
   *       value: "defaultId",
   *       squash: true
   * } }
   * // squash "defaultValue" to "~"
   * params: {
   *     param1: {
   *       value: "defaultValue",
   *       squash: "~"
   * } }
   * </pre>
   *
   *
   * @example
   * <pre>
   * // Some state name examples
   *
   * // stateName can be a single top-level name (must be unique).
   * $stateProvider.state("home", {});
   *
   * // Or it can be a nested state name. This state is a child of the
   * // above "home" state.
   * $stateProvider.state("home.newest", {});
   *
   * // Nest states as deeply as needed.
   * $stateProvider.state("home.newest.abc.xyz.inception", {});
   *
   * // state() returns $stateProvider, so you can chain state declarations.
   * $stateProvider
   *   .state("home", {})
   *   .state("about", {})
   *   .state("contacts", {});
   * </pre>
   *
   */
  this.state = state;
  function state(name, definition) {
    /*jshint validthis: true */
    if (isObject(name)) definition = name;
    else definition.name = name;
    registerState(definition);
    return this;
  }

  /**
   * @ngdoc object
   * @name ui.router.state.$state
   *
   * @requires $rootScope
   * @requires $q
   * @requires ui.router.state.$view
   * @requires $injector
   * @requires ui.router.util.$resolve
   * @requires ui.router.state.$stateParams
   * @requires ui.router.router.$urlRouter
   *
   * @property {object} params A param object, e.g. {sectionId: section.id)}, that 
   * you'd like to test against the current active state.
   * @property {object} current A reference to the state's config object. However 
   * you passed it in. Useful for accessing custom data.
   * @property {object} transition Currently pending transition. A promise that'll 
   * resolve or reject.
   *
   * @description
   * `$state` service is responsible for representing states as well as transitioning
   * between them. It also provides interfaces to ask for current state or even states
   * you're coming from.
   */
  this.$get = $get;
  $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$urlRouter', '$location', '$urlMatcherFactory'];
  function $get(   $rootScope,   $q,   $view,   $injector,   $resolve,   $stateParams,   $urlRouter,   $location,   $urlMatcherFactory) {

    var TransitionSuperseded = $q.reject(new Error('transition superseded'));
    var TransitionPrevented = $q.reject(new Error('transition prevented'));
    var TransitionAborted = $q.reject(new Error('transition aborted'));
    var TransitionFailed = $q.reject(new Error('transition failed'));

    // Handles the case where a state which is the target of a transition is not found, and the user
    // can optionally retry or defer the transition
    function handleRedirect(redirect, state, params, options) {
      /**
       * @ngdoc event
       * @name ui.router.state.$state#$stateNotFound
       * @eventOf ui.router.state.$state
       * @eventType broadcast on root scope
       * @description
       * Fired when a requested state **cannot be found** using the provided state name during transition.
       * The event is broadcast allowing any handlers a single chance to deal with the error (usually by
       * lazy-loading the unfound state). A special `unfoundState` object is passed to the listener handler,
       * you can see its three properties in the example. You can use `event.preventDefault()` to abort the
       * transition and the promise returned from `go` will be rejected with a `'transition aborted'` value.
       *
       * @param {Object} event Event object.
       * @param {Object} unfoundState Unfound State information. Contains: `to, toParams, options` properties.
       * @param {State} fromState Current state object.
       * @param {Object} fromParams Current state params.
       *
       * @example
       *
       * <pre>
       * // somewhere, assume lazy.state has not been defined
       * $state.go("lazy.state", {a:1, b:2}, {inherit:false});
       *
       * // somewhere else
       * $scope.$on('$stateNotFound',
       * function(event, unfoundState, fromState, fromParams){
       *     console.log(unfoundState.to); // "lazy.state"
       *     console.log(unfoundState.toParams); // {a:1, b:2}
       *     console.log(unfoundState.options); // {inherit:false} + default options
       * })
       * </pre>
       */
      var evt = $rootScope.$broadcast('$stateNotFound', redirect, state, params);

      if (evt.defaultPrevented) {
        $urlRouter.update();
        return TransitionAborted;
      }

      if (!evt.retry) {
        return null;
      }

      // Allow the handler to return a promise to defer state lookup retry
      if (options.$retry) {
        $urlRouter.update();
        return TransitionFailed;
      }
      var retryTransition = $state.transition = $q.when(evt.retry);

      retryTransition.then(function() {
        if (retryTransition !== $state.transition) return TransitionSuperseded;
        redirect.options.$retry = true;
        return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
      }, function() {
        return TransitionAborted;
      });
      $urlRouter.update();

      return retryTransition;
    }

    root.locals = { resolve: null, globals: { $stateParams: {} } };

    $state = {
      params: {},
      current: root.self,
      $current: root,
      transition: null
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#reload
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method that force reloads the current state. All resolves are re-resolved, events are not re-fired, 
     * and controllers reinstantiated (bug with controllers reinstantiating right now, fixing soon).
     *
     * @example
     * <pre>
     * var app angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.reload = function(){
     *     $state.reload();
     *   }
     * });
     * </pre>
     *
     * `reload()` is just an alias for:
     * <pre>
     * $state.transitionTo($state.current, $stateParams, { 
     *   reload: true, inherit: false, notify: true
     * });
     * </pre>
     *
     * @returns {promise} A promise representing the state of the new transition. See
     * {@link ui.router.state.$state#methods_go $state.go}.
     */
    $state.reload = function reload() {
      return $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#go
     * @methodOf ui.router.state.$state
     *
     * @description
     * Convenience method for transitioning to a new state. `$state.go` calls 
     * `$state.transitionTo` internally but automatically sets options to 
     * `{ location: true, inherit: true, relative: $state.$current, notify: true }`. 
     * This allows you to easily use an absolute or relative to path and specify 
     * only the parameters you'd like to update (while letting unspecified parameters 
     * inherit from the currently active ancestor states).
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.go('contact.detail');
     *   };
     * });
     * </pre>
     * <img src='../ngdoc_assets/StateGoExamples.png'/>
     *
     * @param {string} to Absolute state name or relative state path. Some examples:
     *
     * - `$state.go('contact.detail')` - will go to the `contact.detail` state
     * - `$state.go('^')` - will go to a parent state
     * - `$state.go('^.sibling')` - will go to a sibling state
     * - `$state.go('.child.grandchild')` - will go to grandchild state
     *
     * @param {object=} params A map of the parameters that will be sent to the state, 
     * will populate $stateParams. Any parameters that are not specified will be inherited from currently 
     * defined parameters. This allows, for example, going to a sibling state that shares parameters
     * specified in a parent state. Parameter inheritance only works between common ancestor states, I.e.
     * transitioning to a sibling will get you the parameters for all parents, transitioning to a child
     * will get you all current parameters, etc.
     * @param {object=} options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *
     * @returns {promise} A promise representing the state of the new transition.
     *
     * Possible success values:
     *
     * - $state.current
     *
     * <br/>Possible rejection values:
     *
     * - 'transition superseded' - when a newer transition has been started after this one
     * - 'transition prevented' - when `event.preventDefault()` has been called in a `$stateChangeStart` listener
     * - 'transition aborted' - when `event.preventDefault()` has been called in a `$stateNotFound` listener or
     *   when a `$stateNotFound` `event.retry` promise errors.
     * - 'transition failed' - when a state has been unsuccessfully found after 2 tries.
     * - *resolve error* - when an error has occurred with a `resolve`
     *
     */
    $state.go = function go(to, params, options) {
      return $state.transitionTo(to, params, extend({ inherit: true, relative: $state.$current }, options));
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#transitionTo
     * @methodOf ui.router.state.$state
     *
     * @description
     * Low-level method for transitioning to a new state. {@link ui.router.state.$state#methods_go $state.go}
     * uses `transitionTo` internally. `$state.go` is recommended in most situations.
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.transitionTo('contact.detail');
     *   };
     * });
     * </pre>
     *
     * @param {string} to State name.
     * @param {object=} toParams A map of the parameters that will be sent to the state,
     * will populate $stateParams.
     * @param {object=} options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=false}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *
     * @returns {promise} A promise representing the state of the new transition. See
     * {@link ui.router.state.$state#methods_go $state.go}.
     */
    $state.transitionTo = function transitionTo(to, toParams, options) {
      toParams = toParams || {};
      options = extend({
        location: true, inherit: false, relative: null, notify: true, reload: false, $retry: false
      }, options || {});

      var from = $state.$current, fromParams = $state.params, fromPath = from.path;
      var evt, toState = findState(to, options.relative);

      if (!isDefined(toState)) {
        var redirect = { to: to, toParams: toParams, options: options };
        var redirectResult = handleRedirect(redirect, from.self, fromParams, options);

        if (redirectResult) {
          return redirectResult;
        }

        // Always retry once if the $stateNotFound was not prevented
        // (handles either redirect changed or state lazy-definition)
        to = redirect.to;
        toParams = redirect.toParams;
        options = redirect.options;
        toState = findState(to, options.relative);

        if (!isDefined(toState)) {
          if (!options.relative) throw new Error("No such state '" + to + "'");
          throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
        }
      }
      if (toState[abstractKey]) throw new Error("Cannot transition to abstract state '" + to + "'");
      if (options.inherit) toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
      if (!toState.params.$$validates(toParams)) return TransitionFailed;

      toParams = toState.params.$$values(toParams);
      to = toState;

      var toPath = to.path;

      // Starting from the root of the path, keep all levels that haven't changed
      var keep = 0, state = toPath[keep], locals = root.locals, toLocals = [];

      if (!options.reload) {
        while (state && state === fromPath[keep] && state.ownParams.$$equals(toParams, fromParams)) {
          locals = toLocals[keep] = state.locals;
          keep++;
          state = toPath[keep];
        }
      }

      // If we're going to the same state and all locals are kept, we've got nothing to do.
      // But clear 'transition', as we still want to cancel any other pending transitions.
      // TODO: We may not want to bump 'transition' if we're called from a location change
      // that we've initiated ourselves, because we might accidentally abort a legitimate
      // transition initiated from code?
      if (shouldTriggerReload(to, from, locals, options)) {
        if (to.self.reloadOnSearch !== false) $urlRouter.update();
        $state.transition = null;
        return $q.when($state.current);
      }

      // Filter parameters before we pass them to event handlers etc.
      toParams = filterByKeys(to.params.$$keys(), toParams || {});

      // Broadcast start event and cancel the transition if requested
      if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeStart
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when the state transition **begins**. You can use `event.preventDefault()`
         * to prevent the transition from happening and then the transition promise will be
         * rejected with a `'transition prevented'` value.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         *
         * @example
         *
         * <pre>
         * $rootScope.$on('$stateChangeStart',
         * function(event, toState, toParams, fromState, fromParams){
         *     event.preventDefault();
         *     // transitionTo() promise will be rejected with
         *     // a 'transition prevented' error
         * })
         * </pre>
         */
        if ($rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams).defaultPrevented) {
          $urlRouter.update();
          return TransitionPrevented;
        }
      }

      // Resolve locals for the remaining states, but don't update any global state just
      // yet -- if anything fails to resolve the current state needs to remain untouched.
      // We also set up an inheritance chain for the locals here. This allows the view directive
      // to quickly look up the correct definition for each view in the current state. Even
      // though we create the locals object itself outside resolveState(), it is initially
      // empty and gets filled asynchronously. We need to keep track of the promise for the
      // (fully resolved) current locals, and pass this down the chain.
      var resolved = $q.when(locals);

      for (var l = keep; l < toPath.length; l++, state = toPath[l]) {
        locals = toLocals[l] = inherit(locals);
        resolved = resolveState(state, toParams, state === to, resolved, locals, options);
      }

      // Once everything is resolved, we are ready to perform the actual transition
      // and return a promise for the new state. We also keep track of what the
      // current promise is, so that we can detect overlapping transitions and
      // keep only the outcome of the last transition.
      var transition = $state.transition = resolved.then(function () {
        var l, entering, exiting;

        if ($state.transition !== transition) return TransitionSuperseded;

        // Exit 'from' states not kept
        for (l = fromPath.length - 1; l >= keep; l--) {
          exiting = fromPath[l];
          if (exiting.self.onExit) {
            $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
          }
          exiting.locals = null;
        }

        // Enter 'to' states not kept
        for (l = keep; l < toPath.length; l++) {
          entering = toPath[l];
          entering.locals = toLocals[l];
          if (entering.self.onEnter) {
            $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
          }
        }

        // Run it again, to catch any transitions in callbacks
        if ($state.transition !== transition) return TransitionSuperseded;

        // Update globals in $state
        $state.$current = to;
        $state.current = to.self;
        $state.params = toParams;
        copy($state.params, $stateParams);
        $state.transition = null;

        if (options.location && to.navigable) {
          $urlRouter.push(to.navigable.url, to.navigable.locals.globals.$stateParams, {
            $$avoidResync: true, replace: options.location === 'replace'
          });
        }

        if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeSuccess
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired once the state transition is **complete**.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         */
          $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
        }
        $urlRouter.update(true);

        return $state.current;
      }, function (error) {
        if ($state.transition !== transition) return TransitionSuperseded;

        $state.transition = null;
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeError
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when an **error occurs** during transition. It's important to note that if you
         * have any errors in your resolve functions (javascript errors, non-existent services, etc)
         * they will not throw traditionally. You must listen for this $stateChangeError event to
         * catch **ALL** errors.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         * @param {Error} error The resolve error object.
         */
        evt = $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);

        if (!evt.defaultPrevented) {
            $urlRouter.update();
        }

        return $q.reject(error);
      });

      return transition;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#is
     * @methodOf ui.router.state.$state
     *
     * @description
     * Similar to {@link ui.router.state.$state#methods_includes $state.includes},
     * but only checks for the full state name. If params is supplied then it will be
     * tested for strict equality against the current active params object, so all params
     * must match with none missing and no extras.
     *
     * @example
     * <pre>
     * $state.$current.name = 'contacts.details.item';
     *
     * // absolute name
     * $state.is('contact.details.item'); // returns true
     * $state.is(contactDetailItemStateObject); // returns true
     *
     * // relative name (. and ^), typically from a template
     * // E.g. from the 'contacts.details' template
     * <div ng-class="{highlighted: $state.is('.item')}">Item</div>
     * </pre>
     *
     * @param {string|object} stateOrName The state name (absolute or relative) or state object you'd like to check.
     * @param {object=} params A param object, e.g. `{sectionId: section.id}`, that you'd like
     * to test against the current active state.
     * @param {object=} options An options object.  The options are:
     *
     * - **`relative`** - {string|object} -  If `stateOrName` is a relative state name and `options.relative` is set, .is will
     * test relative to `options.relative` state (or name).
     *
     * @returns {boolean} Returns true if it is the state.
     */
    $state.is = function is(stateOrName, params, options) {
      options = extend({ relative: $state.$current }, options || {});
      var state = findState(stateOrName, options.relative);

      if (!isDefined(state)) { return undefined; }
      if ($state.$current !== state) { return false; }
      return params ? equalForKeys(state.params.$$values(params), $stateParams) : true;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#includes
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method to determine if the current active state is equal to or is the child of the
     * state stateName. If any params are passed then they will be tested for a match as well.
     * Not all the parameters need to be passed, just the ones you'd like to test for equality.
     *
     * @example
     * Partial and relative names
     * <pre>
     * $state.$current.name = 'contacts.details.item';
     *
     * // Using partial names
     * $state.includes("contacts"); // returns true
     * $state.includes("contacts.details"); // returns true
     * $state.includes("contacts.details.item"); // returns true
     * $state.includes("contacts.list"); // returns false
     * $state.includes("about"); // returns false
     *
     * // Using relative names (. and ^), typically from a template
     * // E.g. from the 'contacts.details' template
     * <div ng-class="{highlighted: $state.includes('.item')}">Item</div>
     * </pre>
     *
     * Basic globbing patterns
     * <pre>
     * $state.$current.name = 'contacts.details.item.url';
     *
     * $state.includes("*.details.*.*"); // returns true
     * $state.includes("*.details.**"); // returns true
     * $state.includes("**.item.**"); // returns true
     * $state.includes("*.details.item.url"); // returns true
     * $state.includes("*.details.*.url"); // returns true
     * $state.includes("*.details.*"); // returns false
     * $state.includes("item.**"); // returns false
     * </pre>
     *
     * @param {string} stateOrName A partial name, relative name, or glob pattern
     * to be searched for within the current state name.
     * @param {object=} params A param object, e.g. `{sectionId: section.id}`,
     * that you'd like to test against the current active state.
     * @param {object=} options An options object.  The options are:
     *
     * - **`relative`** - {string|object=} -  If `stateOrName` is a relative state reference and `options.relative` is set,
     * .includes will test relative to `options.relative` state (or name).
     *
     * @returns {boolean} Returns true if it does include the state
     */
    $state.includes = function includes(stateOrName, params, options) {
      options = extend({ relative: $state.$current }, options || {});
      if (isString(stateOrName) && isGlob(stateOrName)) {
        if (!doesStateMatchGlob(stateOrName)) {
          return false;
        }
        stateOrName = $state.$current.name;
      }

      var state = findState(stateOrName, options.relative);
      if (!isDefined(state)) { return undefined; }
      if (!isDefined($state.$current.includes[state.name])) { return false; }
      return params ? equalForKeys(state.params.$$values(params), $stateParams, objectKeys(params)) : true;
    };


    /**
     * @ngdoc function
     * @name ui.router.state.$state#href
     * @methodOf ui.router.state.$state
     *
     * @description
     * A url generation method that returns the compiled url for the given state populated with the given params.
     *
     * @example
     * <pre>
     * expect($state.href("about.person", { person: "bob" })).toEqual("/about/bob");
     * </pre>
     *
     * @param {string|object} stateOrName The state name or state object you'd like to generate a url from.
     * @param {object=} params An object of parameter values to fill the state's required parameters.
     * @param {object=} options Options object. The options are:
     *
     * - **`lossy`** - {boolean=true} -  If true, and if there is no url associated with the state provided in the
     *    first parameter, then the constructed href url will be built from the first navigable ancestor (aka
     *    ancestor with a valid url).
     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
     * 
     * @returns {string} compiled state url
     */
    $state.href = function href(stateOrName, params, options) {
      options = extend({
        lossy:    true,
        inherit:  true,
        absolute: false,
        relative: $state.$current
      }, options || {});

      var state = findState(stateOrName, options.relative);

      if (!isDefined(state)) return null;
      if (options.inherit) params = inheritParams($stateParams, params || {}, $state.$current, state);
      
      var nav = (state && options.lossy) ? state.navigable : state;

      if (!nav || nav.url === undefined || nav.url === null) {
        return null;
      }
      return $urlRouter.href(nav.url, filterByKeys(state.params.$$keys(), params || {}), {
        absolute: options.absolute
      });
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#get
     * @methodOf ui.router.state.$state
     *
     * @description
     * Returns the state configuration object for any specific state or all states.
     *
     * @param {string|object=} stateOrName (absolute or relative) If provided, will only get the config for
     * the requested state. If not provided, returns an array of ALL state configs.
     * @param {string|object=} context When stateOrName is a relative state reference, the state will be retrieved relative to context.
     * @returns {Object|Array} State configuration object or array of all objects.
     */
    $state.get = function (stateOrName, context) {
      if (arguments.length === 0) return map(objectKeys(states), function(name) { return states[name].self; });
      var state = findState(stateOrName, context || $state.$current);
      return (state && state.self) ? state.self : null;
    };

    function resolveState(state, params, paramsAreFiltered, inherited, dst, options) {
      // Make a restricted $stateParams with only the parameters that apply to this state if
      // necessary. In addition to being available to the controller and onEnter/onExit callbacks,
      // we also need $stateParams to be available for any $injector calls we make during the
      // dependency resolution process.
      var $stateParams = (paramsAreFiltered) ? params : filterByKeys(state.params.$$keys(), params);
      var locals = { $stateParams: $stateParams };

      // Resolve 'global' dependencies for the state, i.e. those not specific to a view.
      // We're also including $stateParams in this; that way the parameters are restricted
      // to the set that should be visible to the state, and are independent of when we update
      // the global $state and $stateParams values.
      dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
      var promises = [dst.resolve.then(function (globals) {
        dst.globals = globals;
      })];
      if (inherited) promises.push(inherited);

      // Resolve template and dependencies for all views.
      forEach(state.views, function (view, name) {
        var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
        injectables.$template = [ function () {
          return $view.load(name, { view: view, locals: locals, params: $stateParams, notify: options.notify }) || '';
        }];

        promises.push($resolve.resolve(injectables, locals, dst.resolve, state).then(function (result) {
          // References to the controller (only instantiated at link time)
          if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
            var injectLocals = angular.extend({}, injectables, locals);
            result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
          } else {
            result.$$controller = view.controller;
          }
          // Provide access to the state itself for internal use
          result.$$state = state;
          result.$$controllerAs = view.controllerAs;
          dst[name] = result;
        }));
      });

      // Wait for all the promises and then return the activation object
      return $q.all(promises).then(function (values) {
        return dst;
      });
    }

    return $state;
  }

  function shouldTriggerReload(to, from, locals, options) {
    if (to === from && ((locals === from.locals && !options.reload) || (to.self.reloadOnSearch === false))) {
      return true;
    }
  }
}

angular.module('ui.router.state')
  .value('$stateParams', {})
  .provider('$state', $StateProvider);


$ViewProvider.$inject = [];
function $ViewProvider() {

  this.$get = $get;
  /**
   * @ngdoc object
   * @name ui.router.state.$view
   *
   * @requires ui.router.util.$templateFactory
   * @requires $rootScope
   *
   * @description
   *
   */
  $get.$inject = ['$rootScope', '$templateFactory'];
  function $get(   $rootScope,   $templateFactory) {
    return {
      // $view.load('full.viewName', { template: ..., controller: ..., resolve: ..., async: false, params: ... })
      /**
       * @ngdoc function
       * @name ui.router.state.$view#load
       * @methodOf ui.router.state.$view
       *
       * @description
       *
       * @param {string} name name
       * @param {object} options option object.
       */
      load: function load(name, options) {
        var result, defaults = {
          template: null, controller: null, view: null, locals: null, notify: true, async: true, params: {}
        };
        options = extend(defaults, options);

        if (options.view) {
          result = $templateFactory.fromConfig(options.view, options.params, options.locals);
        }
        if (result && options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$viewContentLoading
         * @eventOf ui.router.state.$view
         * @eventType broadcast on root scope
         * @description
         *
         * Fired once the view **begins loading**, *before* the DOM is rendered.
         *
         * @param {Object} event Event object.
         * @param {Object} viewConfig The view config properties (template, controller, etc).
         *
         * @example
         *
         * <pre>
         * $scope.$on('$viewContentLoading',
         * function(event, viewConfig){
         *     // Access to all the view config properties.
         *     // and one special property 'targetView'
         *     // viewConfig.targetView
         * });
         * </pre>
         */
          $rootScope.$broadcast('$viewContentLoading', options);
        }
        return result;
      }
    };
  }
}

angular.module('ui.router.state').provider('$view', $ViewProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$uiViewScrollProvider
 *
 * @description
 * Provider that returns the {@link ui.router.state.$uiViewScroll} service function.
 */
function $ViewScrollProvider() {

  var useAnchorScroll = false;

  /**
   * @ngdoc function
   * @name ui.router.state.$uiViewScrollProvider#useAnchorScroll
   * @methodOf ui.router.state.$uiViewScrollProvider
   *
   * @description
   * Reverts back to using the core [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll) service for
   * scrolling based on the url anchor.
   */
  this.useAnchorScroll = function () {
    useAnchorScroll = true;
  };

  /**
   * @ngdoc object
   * @name ui.router.state.$uiViewScroll
   *
   * @requires $anchorScroll
   * @requires $timeout
   *
   * @description
   * When called with a jqLite element, it scrolls the element into view (after a
   * `$timeout` so the DOM has time to refresh).
   *
   * If you prefer to rely on `$anchorScroll` to scroll the view to the anchor,
   * this can be enabled by calling {@link ui.router.state.$uiViewScrollProvider#methods_useAnchorScroll `$uiViewScrollProvider.useAnchorScroll()`}.
   */
  this.$get = ['$anchorScroll', '$timeout', function ($anchorScroll, $timeout) {
    if (useAnchorScroll) {
      return $anchorScroll;
    }

    return function ($element) {
      $timeout(function () {
        $element[0].scrollIntoView();
      }, 0, false);
    };
  }];
}

angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-view
 *
 * @requires ui.router.state.$state
 * @requires $compile
 * @requires $controller
 * @requires $injector
 * @requires ui.router.state.$uiViewScroll
 * @requires $document
 *
 * @restrict ECA
 *
 * @description
 * The ui-view directive tells $state where to place your templates.
 *
 * @param {string=} name A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states.
 *
 * @param {string=} autoscroll It allows you to set the scroll behavior of the browser window
 * when a view is populated. By default, $anchorScroll is overridden by ui-router's custom scroll
 * service, {@link ui.router.state.$uiViewScroll}. This custom service let's you
 * scroll ui-view elements into view when they are populated during a state activation.
 *
 * *Note: To revert back to old [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll)
 * functionality, call `$uiViewScrollProvider.useAnchorScroll()`.*
 *
 * @param {string=} onload Expression to evaluate whenever the view updates.
 * 
 * @example
 * A view can be unnamed or named. 
 * <pre>
 * <!-- Unnamed -->
 * <div ui-view></div> 
 * 
 * <!-- Named -->
 * <div ui-view="viewName"></div>
 * </pre>
 *
 * You can only have one unnamed view within any template (or root html). If you are only using a 
 * single view and it is unnamed then you can populate it like so:
 * <pre>
 * <div ui-view></div> 
 * $stateProvider.state("home", {
 *   template: "<h1>HELLO!</h1>"
 * })
 * </pre>
 * 
 * The above is a convenient shortcut equivalent to specifying your view explicitly with the {@link ui.router.state.$stateProvider#views `views`}
 * config property, by name, in this case an empty name:
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 *     }
 *   }    
 * })
 * </pre>
 * 
 * But typically you'll only use the views property if you name your view or have more than one view 
 * in the same template. There's not really a compelling reason to name a view if its the only one, 
 * but you could if you wanted, like so:
 * <pre>
 * <div ui-view="main"></div>
 * </pre> 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "main": {
 *       template: "<h1>HELLO!</h1>"
 *     }
 *   }    
 * })
 * </pre>
 * 
 * Really though, you'll use views to set up multiple views:
 * <pre>
 * <div ui-view></div>
 * <div ui-view="chart"></div> 
 * <div ui-view="data"></div> 
 * </pre>
 * 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 *     },
 *     "chart": {
 *       template: "<chart_thing/>"
 *     },
 *     "data": {
 *       template: "<data_thing/>"
 *     }
 *   }    
 * })
 * </pre>
 *
 * Examples for `autoscroll`:
 *
 * <pre>
 * <!-- If autoscroll present with no expression,
 *      then scroll ui-view into view -->
 * <ui-view autoscroll/>
 *
 * <!-- If autoscroll present with valid expression,
 *      then scroll ui-view into view if expression evaluates to true -->
 * <ui-view autoscroll='true'/>
 * <ui-view autoscroll='false'/>
 * <ui-view autoscroll='scopeVariable'/>
 * </pre>
 */
$ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll', '$interpolate'];
function $ViewDirective(   $state,   $injector,   $uiViewScroll,   $interpolate) {

  function getService() {
    return ($injector.has) ? function(service) {
      return $injector.has(service) ? $injector.get(service) : null;
    } : function(service) {
      try {
        return $injector.get(service);
      } catch (e) {
        return null;
      }
    };
  }

  var service = getService(),
      $animator = service('$animator'),
      $animate = service('$animate');

  // Returns a set of DOM manipulation functions based on which Angular version
  // it should use
  function getRenderer(attrs, scope) {
    var statics = function() {
      return {
        enter: function (element, target, cb) { target.after(element); cb(); },
        leave: function (element, cb) { element.remove(); cb(); }
      };
    };

    if ($animate) {
      return {
        enter: function(element, target, cb) {
          var promise = $animate.enter(element, null, target, cb);
          if (promise && promise.then) promise.then(cb);
        },
        leave: function(element, cb) {
          var promise = $animate.leave(element, cb);
          if (promise && promise.then) promise.then(cb);
        }
      };
    }

    if ($animator) {
      var animate = $animator && $animator(scope, attrs);

      return {
        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
        leave: function(element, cb) { animate.leave(element); cb(); }
      };
    }

    return statics();
  }

  var directive = {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    compile: function (tElement, tAttrs, $transclude) {
      return function (scope, $element, attrs) {
        var previousEl, currentEl, currentScope, latestLocals,
            onloadExp     = attrs.onload || '',
            autoScrollExp = attrs.autoscroll,
            renderer      = getRenderer(attrs, scope);

        scope.$on('$stateChangeSuccess', function() {
          updateView(false);
        });
        scope.$on('$viewContentLoading', function() {
          updateView(false);
        });

        updateView(true);

        function cleanupLastView() {
          if (previousEl) {
            previousEl.remove();
            previousEl = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }

          if (currentEl) {
            renderer.leave(currentEl, function() {
              previousEl = null;
            });

            previousEl = currentEl;
            currentEl = null;
          }
        }

        function updateView(firstTime) {
          var newScope,
              name            = getUiViewName(scope, attrs, $element, $interpolate),
              previousLocals  = name && $state.$current && $state.$current.locals[name];

          if (!firstTime && previousLocals === latestLocals) return; // nothing to do
          newScope = scope.$new();
          latestLocals = $state.$current.locals[name];

          var clone = $transclude(newScope, function(clone) {
            renderer.enter(clone, $element, function onUiViewEnter() {
              if(currentScope) {
                currentScope.$emit('$viewContentAnimationEnded');
              }

              if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
                $uiViewScroll(clone);
              }
            });
            cleanupLastView();
          });

          currentEl = clone;
          currentScope = newScope;
          /**
           * @ngdoc event
           * @name ui.router.state.directive:ui-view#$viewContentLoaded
           * @eventOf ui.router.state.directive:ui-view
           * @eventType emits on ui-view directive scope
           * @description           *
           * Fired once the view is **loaded**, *after* the DOM is rendered.
           *
           * @param {Object} event Event object.
           */
          currentScope.$emit('$viewContentLoaded');
          currentScope.$eval(onloadExp);
        }
      };
    }
  };

  return directive;
}

$ViewDirectiveFill.$inject = ['$compile', '$controller', '$state', '$interpolate'];
function $ViewDirectiveFill (  $compile,   $controller,   $state,   $interpolate) {
  return {
    restrict: 'ECA',
    priority: -400,
    compile: function (tElement) {
      var initial = tElement.html();
      return function (scope, $element, attrs) {
        var current = $state.$current,
            name = getUiViewName(scope, attrs, $element, $interpolate),
            locals  = current && current.locals[name];

        if (! locals) {
          return;
        }

        $element.data('$uiView', { name: name, state: locals.$$state });
        $element.html(locals.$template ? locals.$template : initial);

        var link = $compile($element.contents());

        if (locals.$$controller) {
          locals.$scope = scope;
          var controller = $controller(locals.$$controller, locals);
          if (locals.$$controllerAs) {
            scope[locals.$$controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }

        link(scope);
      };
    }
  };
}

/**
 * Shared ui-view code for both directives:
 * Given scope, element, and its attributes, return the view's name
 */
function getUiViewName(scope, attrs, element, $interpolate) {
  var name = $interpolate(attrs.uiView || attrs.name || '')(scope);
  var inherited = element.inheritedData('$uiView');
  return name.indexOf('@') >= 0 ?  name :  (name + '@' + (inherited ? inherited.state.name : ''));
}

angular.module('ui.router.state').directive('uiView', $ViewDirective);
angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);

function parseStateRef(ref, current) {
  var preparsed = ref.match(/^\s*({[^}]*})\s*$/), parsed;
  if (preparsed) ref = current + '(' + preparsed[1] + ')';
  parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
  if (!parsed || parsed.length !== 4) throw new Error("Invalid state ref '" + ref + "'");
  return { state: parsed[1], paramExpr: parsed[3] || null };
}

function stateContext(el) {
  var stateData = el.parent().inheritedData('$uiView');

  if (stateData && stateData.state && stateData.state.name) {
    return stateData.state;
  }
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref
 *
 * @requires ui.router.state.$state
 * @requires $timeout
 *
 * @restrict A
 *
 * @description
 * A directive that binds a link (`<a>` tag) to a state. If the state has an associated 
 * URL, the directive will automatically generate & update the `href` attribute via 
 * the {@link ui.router.state.$state#methods_href $state.href()} method. Clicking 
 * the link will trigger a state transition with optional parameters. 
 *
 * Also middle-clicking, right-clicking, and ctrl-clicking on the link will be 
 * handled natively by the browser.
 *
 * You can also use relative state paths within ui-sref, just like the relative 
 * paths passed to `$state.go()`. You just need to be aware that the path is relative
 * to the state that the link lives in, in other words the state that loaded the 
 * template containing the link.
 *
 * You can specify options to pass to {@link ui.router.state.$state#go $state.go()}
 * using the `ui-sref-opts` attribute. Options are restricted to `location`, `inherit`,
 * and `reload`.
 *
 * @example
 * Here's an example of how you'd use ui-sref and how it would compile. If you have the 
 * following template:
 * <pre>
 * <a ui-sref="home">Home</a> | <a ui-sref="about">About</a> | <a ui-sref="{page: 2}">Next page</a>
 * 
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a ui-sref="contacts.detail({ id: contact.id })">{{ contact.name }}</a>
 *     </li>
 * </ul>
 * </pre>
 * 
 * Then the compiled html would be (assuming Html5Mode is off and current state is contacts):
 * <pre>
 * <a href="#/home" ui-sref="home">Home</a> | <a href="#/about" ui-sref="about">About</a> | <a href="#/contacts?page=2" ui-sref="{page: 2}">Next page</a>
 * 
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id })">Joe</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id })">Alice</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id })">Bob</a>
 *     </li>
 * </ul>
 *
 * <a ui-sref="home" ui-sref-opts="{reload: true}">Home</a>
 * </pre>
 *
 * @param {string} ui-sref 'stateName' can be any valid absolute or relative state
 * @param {Object} ui-sref-opts options to pass to {@link ui.router.state.$state#go $state.go()}
 */
$StateRefDirective.$inject = ['$state', '$timeout'];
function $StateRefDirective($state, $timeout) {
  var allowedOptions = ['location', 'inherit', 'reload'];

  return {
    restrict: 'A',
    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
    link: function(scope, element, attrs, uiSrefActive) {
      var ref = parseStateRef(attrs.uiSref, $state.current.name);
      var params = null, url = null, base = stateContext(element) || $state.$current;
      var newHref = null, isAnchor = element.prop("tagName") === "A";
      var isForm = element[0].nodeName === "FORM";
      var attr = isForm ? "action" : "href", nav = true;

      var options = { relative: base, inherit: true };
      var optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};

      angular.forEach(allowedOptions, function(option) {
        if (option in optionsOverride) {
          options[option] = optionsOverride[option];
        }
      });

      var update = function(newVal) {
        if (newVal) params = angular.copy(newVal);
        if (!nav) return;

        newHref = $state.href(ref.state, params, options);

        var activeDirective = uiSrefActive[1] || uiSrefActive[0];
        if (activeDirective) {
          activeDirective.$$setStateInfo(ref.state, params);
        }
        if (newHref === null) {
          nav = false;
          return false;
        }
        attrs.$set(attr, newHref);
      };

      if (ref.paramExpr) {
        scope.$watch(ref.paramExpr, function(newVal, oldVal) {
          if (newVal !== params) update(newVal);
        }, true);
        params = angular.copy(scope.$eval(ref.paramExpr));
      }
      update();

      if (isForm) return;

      element.bind("click", function(e) {
        var button = e.which || e.button;
        if ( !(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr('target')) ) {
          // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
          var transition = $timeout(function() {
            $state.go(ref.state, params, options);
          });
          e.preventDefault();

          // if the state has no URL, ignore one preventDefault from the <a> directive.
          var ignorePreventDefaultCount = isAnchor && !newHref ? 1: 0;
          e.preventDefault = function() {
            if (ignorePreventDefaultCount-- <= 0)
              $timeout.cancel(transition);
          };
        }
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref-active
 *
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires $interpolate
 *
 * @restrict A
 *
 * @description
 * A directive working alongside ui-sref to add classes to an element when the
 * related ui-sref directive's state is active, and removing them when it is inactive.
 * The primary use-case is to simplify the special appearance of navigation menus
 * relying on `ui-sref`, by having the "active" state's menu button appear different,
 * distinguishing it from the inactive menu items.
 *
 * ui-sref-active can live on the same element as ui-sref or on a parent element. The first
 * ui-sref-active found at the same level or above the ui-sref will be used.
 *
 * Will activate when the ui-sref's target state or any child state is active. If you
 * need to activate only when the ui-sref target state is active and *not* any of
 * it's children, then you will use
 * {@link ui.router.state.directive:ui-sref-active-eq ui-sref-active-eq}
 *
 * @example
 * Given the following template:
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item">
 *     <a href ui-sref="app.user({user: 'bilbobaggins'})">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 *
 *
 * When the app state is "app.user" (or any children states), and contains the state parameter "user" with value "bilbobaggins",
 * the resulting HTML will appear as (note the 'active' class):
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item active">
 *     <a ui-sref="app.user({user: 'bilbobaggins'})" href="/users/bilbobaggins">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 *
 * The class name is interpolated **once** during the directives link time (any further changes to the
 * interpolated value are ignored).
 *
 * Multiple classes may be specified in a space-separated format:
 * <pre>
 * <ul>
 *   <li ui-sref-active='class1 class2 class3'>
 *     <a ui-sref="app.user">link</a>
 *   </li>
 * </ul>
 * </pre>
 */

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref-active-eq
 *
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires $interpolate
 *
 * @restrict A
 *
 * @description
 * The same as {@link ui.router.state.directive:ui-sref-active ui-sref-active} but will only activate
 * when the exact target state used in the `ui-sref` is active; no child states.
 *
 */
$StateRefActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
function $StateRefActiveDirective($state, $stateParams, $interpolate) {
  return  {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
      var state, params, activeClass;

      // There probably isn't much point in $observing this
      // uiSrefActive and uiSrefActiveEq share the same directive object with some
      // slight difference in logic routing
      activeClass = $interpolate($attrs.uiSrefActiveEq || $attrs.uiSrefActive || '', false)($scope);

      // Allow uiSref to communicate with uiSrefActive[Equals]
      this.$$setStateInfo = function (newState, newParams) {
        state = $state.get(newState, stateContext($element));
        params = newParams;
        update();
      };

      $scope.$on('$stateChangeSuccess', update);

      // Update route state
      function update() {
        if (isMatch()) {
          $element.addClass(activeClass);
        } else {
          $element.removeClass(activeClass);
        }
      }

      function isMatch() {
        if (typeof $attrs.uiSrefActiveEq !== 'undefined') {
          return state && $state.is(state.name, params);
        } else {
          return state && $state.includes(state.name, params);
        }
      }
    }]
  };
}

angular.module('ui.router.state')
  .directive('uiSref', $StateRefDirective)
  .directive('uiSrefActive', $StateRefActiveDirective)
  .directive('uiSrefActiveEq', $StateRefActiveDirective);

/**
 * @ngdoc filter
 * @name ui.router.state.filter:isState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_is $state.is("stateName")}.
 */
$IsStateFilter.$inject = ['$state'];
function $IsStateFilter($state) {
  var isFilter = function (state) {
    return $state.is(state);
  };
  isFilter.$stateful = true;
  return isFilter;
}

/**
 * @ngdoc filter
 * @name ui.router.state.filter:includedByState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_includes $state.includes('fullOrPartialStateName')}.
 */
$IncludedByStateFilter.$inject = ['$state'];
function $IncludedByStateFilter($state) {
  var includesFilter = function (state) {
    return $state.includes(state);
  };
  includesFilter.$stateful = true;
  return  includesFilter;
}

angular.module('ui.router.state')
  .filter('isState', $IsStateFilter)
  .filter('includedByState', $IncludedByStateFilter);
})(window, window.angular);
/*
textAngular
Author : Austin Anderson
License : 2013 MIT
Version 1.2.2

See README.md or https://github.com/fraywing/textAngular/wiki for requirements and use.
*/

(function(){ // encapsulate all variables so they don't become global vars
	"Use Strict";

	// fix a webkit bug, see: https://gist.github.com/shimondoodkin/1081133
	// this is set true when a blur occurs as the blur of the ta-bind triggers before the click
	var globalContentEditableBlur = false;
	/* istanbul ignore next: Browser Un-Focus fix for webkit */
	if(/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)) { // detect webkit
		document.addEventListener("click", function(){
			var curelement = window.event.target;
			if(globalContentEditableBlur && curelement !== null){
				var isEditable = false;
				var tempEl = curelement;
				while(tempEl !== null && tempEl.tagName.toLowerCase() !== 'html' && !isEditable){
					isEditable = tempEl.contentEditable === 'true';
					tempEl = tempEl.parentNode;
				}
				if(!isEditable){
					document.getElementById('textAngular-editableFix-010203040506070809').setSelectionRange(0, 0); // set caret focus to an element that handles caret focus correctly.
					curelement.focus(); // focus the wanted element.
				}
			}
			globalContentEditableBlur = false;
		}, false); // add global click handler
		angular.element(document).ready(function () {
			angular.element(document.body).append(angular.element('<input id="textAngular-editableFix-010203040506070809" style="width:1px;height:1px;border:none;margin:0;padding:0;position:absolute; top: -10000; left: -10000;" unselectable="on" tabIndex="-1">'));
		});
	}
	// IE version detection - http://stackoverflow.com/questions/4169160/javascript-ie-detection-why-not-use-simple-conditional-comments
	// We need this as IE sometimes plays funny tricks with the contenteditable.
	// ----------------------------------------------------------
	// If you're not in IE (or IE version is less than 5) then:
	// ie === undefined
	// If you're in IE (>=5) then you can determine which version:
	// ie === 7; // IE7
	// Thus, to detect IE:
	// if (ie) {}
	// And to detect the version:
	// ie === 6 // IE6
	// ie > 7 // IE8, IE9, IE10 ...
	// ie < 9 // Anything less than IE9
	// ----------------------------------------------------------
	/* istanbul ignore next: untestable browser check */
	var ie = (function(){
		var undef,rv = -1; // Return value assumes failure.
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf('MSIE ');
		var trident = ua.indexOf('Trident/');

		if (msie > 0) {
			// IE 10 or older => return version number
			rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		} else if (trident > 0) {
			// IE 11 (or newer) => return version number
			var rvNum = ua.indexOf('rv:');
			rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
		}

		return ((rv > -1) ? rv : undef);
	}());

	// Thanks to answer in http://stackoverflow.com/questions/2308134/trim-in-javascript-not-working-in-ie
	/* istanbul ignore next: trim shim for older browsers */
	if(typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		};
	}

	// tests against the current jqLite/jquery implementation if this can be an element
	function validElementString(string){
		try{
			return angular.element(string).length !== 0;
		}catch(any){
			return false;
		}
	}

	/*
		Custom stylesheet for the placeholders rules.
		Credit to: http://davidwalsh.name/add-rules-stylesheets
	*/
	var sheet, addCSSRule, removeCSSRule, _addCSSRule, _removeCSSRule;
	/* istanbul ignore else: IE <8 test*/
	if(ie > 8 || ie === undefined){
		var topsheet = (function() {
			// Create the <style> tag
			var style = document.createElement("style");
			/* istanbul ignore else : WebKit hack :( */
			if(/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)) style.appendChild(document.createTextNode(""));

			// Add the <style> element to the page, add as first so the styles can be overridden by custom stylesheets
			document.head.insertBefore(style,document.head.firstChild);

			return style.sheet;
		})();

		// this sheet is used for the placeholders later on.
		sheet = (function() {
			// Create the <style> tag
			var style = document.createElement("style");
			/* istanbul ignore else : WebKit hack :( */
			if(/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)) style.appendChild(document.createTextNode(""));

			// Add the <style> element to the page, add as first so the styles can be overridden by custom stylesheets
			document.head.appendChild(style);

			return style.sheet;
		})();

		// use as: addCSSRule("header", "float: left");
		addCSSRule = function(selector, rules) {
			_addCSSRule(sheet, selector, rules);
		};
		_addCSSRule = function(sheet, selector, rules){
			var insertIndex;
			/* istanbul ignore else: firefox catch */
			if(sheet.rules) insertIndex = Math.max(sheet.rules.length - 1, 0);
			else if(sheet.cssRules) insertIndex = Math.max(sheet.cssRules.length - 1, 0);
			/* istanbul ignore else: untestable IE option */
			if(sheet.insertRule) {
				sheet.insertRule(selector + "{" + rules + "}", insertIndex);
			}
			else {
				sheet.addRule(selector, rules, insertIndex);
			}
			// return the index of the stylesheet rule
			return insertIndex;
		};

		removeCSSRule = function(index){
			_removeCSSRule(sheet, index);
		};
		_removeCSSRule = function(sheet, index){
			/* istanbul ignore else: untestable IE option */
			if(sheet.removeRule){
				sheet.removeRule(index);
			}else{
				sheet.deleteRule(index);
			}
		};

		// add generic styling for the editor
		_addCSSRule(topsheet, '.ta-scroll-window.form-control', "height: auto; min-height: 300px; overflow: auto; font-family: inherit; font-size: 100%; position: relative; padding: 0;");
		_addCSSRule(topsheet, '.ta-root.focussed .ta-scroll-window.form-control', 'border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);');
		_addCSSRule(topsheet, '.ta-editor.ta-html', "min-height: 300px; height: auto; overflow: auto; font-family: inherit; font-size: 100%;");
		_addCSSRule(topsheet, '.ta-scroll-window > .ta-bind', "height: auto; min-height: 300px; padding: 6px 12px;");

		// add the styling for the awesomness of the resizer
		_addCSSRule(topsheet, '.ta-root .ta-resizer-handle-overlay', 'z-index: 100; position: absolute; display: none;');
		_addCSSRule(topsheet, '.ta-root .ta-resizer-handle-overlay > .ta-resizer-handle-info', 'position: absolute; bottom: 16px; right: 16px; border: 1px solid black; background-color: #FFF; padding: 0 4px; opacity: 0.7;');
		_addCSSRule(topsheet, '.ta-root .ta-resizer-handle-overlay > .ta-resizer-handle-background', 'position: absolute; bottom: 5px; right: 5px; left: 5px; top: 5px; border: 1px solid black; background-color: rgba(0, 0, 0, 0.2);');
		_addCSSRule(topsheet, '.ta-root .ta-resizer-handle-overlay > .ta-resizer-handle-corner', 'width: 10px; height: 10px; position: absolute;');
		_addCSSRule(topsheet, '.ta-root .ta-resizer-handle-overlay > .ta-resizer-handle-corner-tl', 'top: 0; left: 0; border-left: 1px solid black; border-top: 1px solid black;');
		_addCSSRule(topsheet, '.ta-root .ta-resizer-handle-overlay > .ta-resizer-handle-corner-tr', 'top: 0; right: 0; border-right: 1px solid black; border-top: 1px solid black;');
		_addCSSRule(topsheet, '.ta-root .ta-resizer-handle-overlay > .ta-resizer-handle-corner-bl', 'bottom: 0; left: 0; border-left: 1px solid black; border-bottom: 1px solid black;');
		_addCSSRule(topsheet, '.ta-root .ta-resizer-handle-overlay > .ta-resizer-handle-corner-br', 'bottom: 0; right: 0; border: 1px solid black; cursor: se-resize; background-color: white;');
	}

	// recursive function that returns an array of angular.elements that have the passed attribute set on them
	function getByAttribute(element, attribute){
		var resultingElements = [];
		var childNodes = element.children();
		if(childNodes.length){
			angular.forEach(childNodes, function(child){
				resultingElements = resultingElements.concat(getByAttribute(angular.element(child), attribute));
			});
		}
		if(element.attr(attribute) !== undefined) resultingElements.push(element);
		return resultingElements;
	}

	// this global var is used to prevent multiple fires of the drop event. Needs to be global to the textAngular file.
	var dropFired = false;
	var textAngular = angular.module("textAngular", ['ngSanitize', 'textAngularSetup']); //This makes ngSanitize required

	// setup the global contstant functions for setting up the toolbar

	// all tool definitions
	var taTools = {};
	/*
		A tool definition is an object with the following key/value parameters:
			action: [function(deferred, restoreSelection)]
					a function that is executed on clicking on the button - this will allways be executed using ng-click and will
					overwrite any ng-click value in the display attribute.
					The function is passed a deferred object ($q.defer()), if this is wanted to be used `return false;` from the action and
					manually call `deferred.resolve();` elsewhere to notify the editor that the action has finished.
					restoreSelection is only defined if the rangy library is included and it can be called as `restoreSelection()` to restore the users
					selection in the WYSIWYG editor.
			display: [string]?
					Optional, an HTML element to be displayed as the button. The `scope` of the button is the tool definition object with some additional functions
					If set this will cause buttontext and iconclass to be ignored
			buttontext: [string]?
					if this is defined it will replace the contents of the element contained in the `display` element
			iconclass: [string]?
					if this is defined an icon (<i>) will be appended to the `display` element with this string as it's class
			tooltiptext: [string]?
					Optional, a plain text description of the action, used for the title attribute of the action button in the toolbar by default.
			activestate: [function(commonElement)]?
					this function is called on every caret movement, if it returns true then the class taOptions.classes.toolbarButtonActive
					will be applied to the `display` element, else the class will be removed
			disabled: [function()]?
					if this function returns true then the tool will have the class taOptions.classes.disabled applied to it, else it will be removed
		Other functions available on the scope are:
			name: [string]
					the name of the tool, this is the first parameter passed into taRegisterTool
			isDisabled: [function()]
					returns true if the tool is disabled, false if it isn't
			displayActiveToolClass: [function(boolean)]
					returns true if the tool is 'active' in the currently focussed toolbar
			onElementSelect: [Object]
					This object contains the following key/value pairs and is used to trigger the ta-element-select event
					element: [String]
						an element name, will only trigger the onElementSelect action if the tagName of the element matches this string
					filter: [function(element)]?
						an optional filter that returns a boolean, if true it will trigger the onElementSelect.
					action: [function(event, element, editorScope)]
						the action that should be executed if the onElementSelect function runs
	*/
	// name and toolDefinition to add into the tools available to be added on the toolbar
	function registerTextAngularTool(name, toolDefinition){
		if(!name || name === '' || taTools.hasOwnProperty(name)) throw('textAngular Error: A unique name is required for a Tool Definition');
		if(
			(toolDefinition.display && (toolDefinition.display === '' || !validElementString(toolDefinition.display))) ||
			(!toolDefinition.display && !toolDefinition.buttontext && !toolDefinition.iconclass)
		)
			throw('textAngular Error: Tool Definition for "' + name + '" does not have a valid display/iconclass/buttontext value');
		taTools[name] = toolDefinition;
	}

	textAngular.constant('taRegisterTool', registerTextAngularTool);
	textAngular.value('taTools', taTools);

	textAngular.config([function(){
		// clear taTools variable. Just catches testing and any other time that this config may run multiple times...
		angular.forEach(taTools, function(value, key){ delete taTools[key];	});
	}]);

	textAngular.directive("textAngular", [
		'$compile', '$timeout', 'taOptions', 'taSelection', 'taExecCommand', 'textAngularManager', '$window', '$document', '$animate', '$log',
		function($compile, $timeout, taOptions, taSelection, taExecCommand, textAngularManager, $window, $document, $animate, $log){
			return {
				require: '?ngModel',
				scope: {},
				restrict: "EA",
				link: function(scope, element, attrs, ngModel){
					// all these vars should not be accessable outside this directive
					var _keydown, _keyup, _keypress, _mouseup, _mousedown, _focusin, _focusout,
						_originalContents, _toolbars,
						_serial = (attrs.serial) ? attrs.serial : Math.floor(Math.random() * 10000000000000000),
						_name = (attrs.name) ? attrs.name : 'textAngularEditor' + _serial,
						_taExecCommand;

					var oneEvent = function(_element, event, action){
						$timeout(function(){
							// shim the .one till fixed
							var _func = function(){
								_element.off(event, _func);
								action();
							};
							_element.on(event, _func);
						}, 100);
					};
					_taExecCommand = taExecCommand(attrs.taDefaultWrap);
					// get the settings from the defaults and add our specific functions that need to be on the scope
					angular.extend(scope, angular.copy(taOptions), {
						// wraps the selection in the provided tag / execCommand function. Should only be called in WYSIWYG mode.
						wrapSelection: function(command, opt, isSelectableElementTool){
							// catch errors like FF erroring when you try to force an undo with nothing done
							_taExecCommand(command, false, opt);
							if(isSelectableElementTool){
								// re-apply the selectable tool events
								scope['reApplyOnSelectorHandlerstaTextElement' + _serial]();
							}
							// refocus on the shown display element, this fixes a display bug when using :focus styles to outline the box.
							// You still have focus on the text/html input it just doesn't show up
							scope.displayElements.text[0].focus();
						},
						showHtml: false
					});
					// setup the options from the optional attributes
					if(attrs.taFocussedClass)			scope.classes.focussed = attrs.taFocussedClass;
					if(attrs.taTextEditorClass)			scope.classes.textEditor = attrs.taTextEditorClass;
					if(attrs.taHtmlEditorClass)			scope.classes.htmlEditor = attrs.taHtmlEditorClass;
					// optional setup functions
					if(attrs.taTextEditorSetup)			scope.setup.textEditorSetup = scope.$parent.$eval(attrs.taTextEditorSetup);
					if(attrs.taHtmlEditorSetup)			scope.setup.htmlEditorSetup = scope.$parent.$eval(attrs.taHtmlEditorSetup);
					// optional fileDropHandler function
					if(attrs.taFileDrop)				scope.fileDropHandler = scope.$parent.$eval(attrs.taFileDrop);
					else								scope.fileDropHandler = scope.defaultFileDropHandler;

					_originalContents = element[0].innerHTML;
					// clear the original content
					element[0].innerHTML = '';

					// Setup the HTML elements as variable references for use later
					scope.displayElements = {
						// we still need the hidden input even with a textarea as the textarea may have invalid/old input in it,
						// wheras the input will ALLWAYS have the correct value.
						forminput: angular.element("<input type='hidden' tabindex='-1' style='display: none;'>"),
						html: angular.element("<textarea></textarea>"),
						text: angular.element("<div></div>"),
						// other toolbased elements
						scrollWindow: angular.element("<div class='ta-scroll-window'></div>"),
						popover: angular.element('<div class="popover fade bottom" style="max-width: none; width: 305px;"></div>'),
						popoverArrow: angular.element('<div class="arrow"></div>'),
						popoverContainer: angular.element('<div class="popover-content"></div>'),
						resize: {
							overlay: angular.element('<div class="ta-resizer-handle-overlay"></div>'),
							background: angular.element('<div class="ta-resizer-handle-background"></div>'),
							anchors: [
								angular.element('<div class="ta-resizer-handle-corner ta-resizer-handle-corner-tl"></div>'),
								angular.element('<div class="ta-resizer-handle-corner ta-resizer-handle-corner-tr"></div>'),
								angular.element('<div class="ta-resizer-handle-corner ta-resizer-handle-corner-bl"></div>'),
								angular.element('<div class="ta-resizer-handle-corner ta-resizer-handle-corner-br"></div>')
							],
							info: angular.element('<div class="ta-resizer-handle-info"></div>')
						}
					};

					// Setup the popover
					scope.displayElements.popover.append(scope.displayElements.popoverArrow);
					scope.displayElements.popover.append(scope.displayElements.popoverContainer);
					scope.displayElements.scrollWindow.append(scope.displayElements.popover);

					scope.displayElements.popover.on('mousedown', function(e, eventData){
						/* istanbul ignore else: this is for catching the jqLite testing*/
						if(eventData) angular.extend(e, eventData);
						// this prevents focusout from firing on the editor when clicking anything in the popover
						e.preventDefault();
						return false;
					});

					// define the popover show and hide functions
					scope.showPopover = function(_el){
						scope.displayElements.popover.css('display', 'block');
						scope.reflowPopover(_el);
						$animate.addClass(scope.displayElements.popover, 'in');
						oneEvent(element, 'click keyup', function(){scope.hidePopover();});
					};
					scope.reflowPopover = function(_el){
						if(scope.displayElements.text[0].offsetHeight - 51 > _el[0].offsetTop){
							scope.displayElements.popover.css('top', _el[0].offsetTop + _el[0].offsetHeight + 'px');
							scope.displayElements.popover.removeClass('top').addClass('bottom');
						}else{
							scope.displayElements.popover.css('top', _el[0].offsetTop - 54 + 'px');
							scope.displayElements.popover.removeClass('bottom').addClass('top');
						}
						var _maxLeft = scope.displayElements.text[0].offsetWidth - scope.displayElements.popover[0].offsetWidth;
						var _targetLeft = _el[0].offsetLeft + (_el[0].offsetWidth / 2.0) - (scope.displayElements.popover[0].offsetWidth / 2.0);
						scope.displayElements.popover.css('left', Math.max(0, Math.min(_maxLeft, _targetLeft)) + 'px');
						scope.displayElements.popoverArrow.css('margin-left', (Math.min(_targetLeft, (Math.max(0, _targetLeft - _maxLeft))) - 11) + 'px');
					};
					scope.hidePopover = function(){
						$animate.removeClass(scope.displayElements.popover, 'in', /* istanbul ignore next: dosen't test with mocked animate */ function(){
							scope.displayElements.popover.css('display', '');
							scope.displayElements.popoverContainer.attr('style', '');
							scope.displayElements.popoverContainer.attr('class', 'popover-content');
						});
					};

					// setup the resize overlay
					scope.displayElements.resize.overlay.append(scope.displayElements.resize.background);
					angular.forEach(scope.displayElements.resize.anchors, function(anchor){ scope.displayElements.resize.overlay.append(anchor);});
					scope.displayElements.resize.overlay.append(scope.displayElements.resize.info);
					scope.displayElements.scrollWindow.append(scope.displayElements.resize.overlay);

					// define the show and hide events
					scope.reflowResizeOverlay = function(_el){
						_el = angular.element(_el)[0];
						scope.displayElements.resize.overlay.css({
							'display': 'block',
							'left': _el.offsetLeft - 5 + 'px',
							'top': _el.offsetTop - 5 + 'px',
							'width': _el.offsetWidth + 10 + 'px',
							'height': _el.offsetHeight + 10 + 'px'
						});
						scope.displayElements.resize.info.text(_el.offsetWidth + ' x ' + _el.offsetHeight);
					};
					/* istanbul ignore next: pretty sure phantomjs won't test this */
					scope.showResizeOverlay = function(_el){
						var resizeMouseDown = function(event){
							var startPosition = {
								width: parseInt(_el.attr('width')),
								height: parseInt(_el.attr('height')),
								x: event.clientX,
								y: event.clientY
							};
							if(startPosition.width === undefined) startPosition.width = _el[0].offsetWidth;
							if(startPosition.height === undefined) startPosition.height = _el[0].offsetHeight;
							scope.hidePopover();
							var ratio = startPosition.height / startPosition.width;
							var mousemove = function(event){
								// calculate new size
								var pos = {
									x: Math.max(0, startPosition.width + (event.clientX - startPosition.x)),
									y: Math.max(0, startPosition.height + (event.clientY - startPosition.y))
								};
								var applyImageSafeCSS = function(_el, css){
									_el = angular.element(_el);
									if(_el[0].tagName.toLowerCase() === 'img'){
										if(css.height){
											_el.attr('height', css.height);
											delete css.height;
										}
										if(css.width){
											_el.attr('width', css.width);
											delete css.width;
										}
									}
									_el.css(css);
								};
								if(event.shiftKey){
									// keep ratio
									var newRatio = pos.y / pos.x;
									applyImageSafeCSS(_el, {
										width: ratio > newRatio ? pos.x : pos.y / ratio,
										height: ratio > newRatio ? pos.x * ratio : pos.y
									});
								}else{
									applyImageSafeCSS(_el, {
										width: pos.x,
										height: pos.y
									});
								}
								// reflow the popover tooltip
								scope.reflowResizeOverlay(_el);
							};
							$document.find('body').on('mousemove', mousemove);
							oneEvent(scope.displayElements.resize.overlay, 'mouseup', function(){
								$document.find('body').off('mousemove', mousemove);
								scope.showPopover(_el);
							});
							event.stopPropagation();
							event.preventDefault();
						};

						scope.displayElements.resize.anchors[3].on('mousedown', resizeMouseDown);

						scope.reflowResizeOverlay(_el);
						oneEvent(element, 'click', function(){scope.hideResizeOverlay();});
					};
					/* istanbul ignore next: pretty sure phantomjs won't test this */
					scope.hideResizeOverlay = function(){
						scope.displayElements.resize.overlay.css('display', '');
					};

					// allow for insertion of custom directives on the textarea and div
					scope.setup.htmlEditorSetup(scope.displayElements.html);
					scope.setup.textEditorSetup(scope.displayElements.text);
					scope.displayElements.html.attr({
						'id': 'taHtmlElement' + _serial,
						'ng-show': 'showHtml',
						'ta-bind': 'ta-bind',
						'ng-model': 'html'
					});
					scope.displayElements.text.attr({
						'id': 'taTextElement' + _serial,
						'contentEditable': 'true',
						'ta-bind': 'ta-bind',
						'ng-model': 'html'
					});
					scope.displayElements.scrollWindow.attr({'ng-hide': 'showHtml'});
					if(attrs.taDefaultWrap) scope.displayElements.text.attr('ta-default-wrap', attrs.taDefaultWrap);
					
					if(attrs.taUnsafeSanitizer){
						scope.displayElements.text.attr('ta-unsafe-sanitizer', attrs.taUnsafeSanitizer);
						scope.displayElements.html.attr('ta-unsafe-sanitizer', attrs.taUnsafeSanitizer);
					}
					
					// add the main elements to the origional element
					scope.displayElements.scrollWindow.append(scope.displayElements.text);
					element.append(scope.displayElements.scrollWindow);
					element.append(scope.displayElements.html);

					scope.displayElements.forminput.attr('name', _name);
					element.append(scope.displayElements.forminput);

					if(attrs.tabindex){
						element.removeAttr('tabindex');
						scope.displayElements.text.attr('tabindex', attrs.tabindex);
						scope.displayElements.html.attr('tabindex', attrs.tabindex);
					}

					if (attrs.placeholder) {
						scope.displayElements.text.attr('placeholder', attrs.placeholder);
						scope.displayElements.html.attr('placeholder', attrs.placeholder);
					}

					if(attrs.taDisabled){
						scope.displayElements.text.attr('ta-readonly', 'disabled');
						scope.displayElements.html.attr('ta-readonly', 'disabled');
						scope.disabled = scope.$parent.$eval(attrs.taDisabled);
						scope.$parent.$watch(attrs.taDisabled, function(newVal){
							scope.disabled = newVal;
							if(scope.disabled){
								element.addClass(scope.classes.disabled);
							}else{
								element.removeClass(scope.classes.disabled);
							}
						});
					}

					// compile the scope with the text and html elements only - if we do this with the main element it causes a compile loop
					$compile(scope.displayElements.scrollWindow)(scope);
					$compile(scope.displayElements.html)(scope);

					scope.updateTaBindtaTextElement = scope['updateTaBindtaTextElement' + _serial];
					scope.updateTaBindtaHtmlElement = scope['updateTaBindtaHtmlElement' + _serial];

					// add the classes manually last
					element.addClass("ta-root");
					scope.displayElements.scrollWindow.addClass("ta-text ta-editor " + scope.classes.textEditor);
					scope.displayElements.html.addClass("ta-html ta-editor " + scope.classes.htmlEditor);

					// used in the toolbar actions
					scope._actionRunning = false;
					var _savedSelection = false;
					scope.startAction = function(){
						scope._actionRunning = true;
						// if rangy library is loaded return a function to reload the current selection
						if($window.rangy && $window.rangy.saveSelection){
							_savedSelection = $window.rangy.saveSelection();
							return function(){
								if(_savedSelection) $window.rangy.restoreSelection(_savedSelection);
							};
						}
					};
					scope.endAction = function(){
						scope._actionRunning = false;
						if(_savedSelection) $window.rangy.removeMarkers(_savedSelection);
						_savedSelection = false;
						scope.updateSelectedStyles();
						// only update if in text or WYSIWYG mode
						if(!scope.showHtml) scope['updateTaBindtaTextElement' + _serial]();
					};

					// note that focusout > focusin is called everytime we click a button - except bad support: http://www.quirksmode.org/dom/events/blurfocus.html
					// cascades to displayElements.text and displayElements.html automatically.
					_focusin = function(){
						element.addClass(scope.classes.focussed);
						_toolbars.focus();
					};
					scope.displayElements.html.on('focus', _focusin);
					scope.displayElements.text.on('focus', _focusin);
					_focusout = function(e){
						// if we are NOT runnig an action and have NOT focussed again on the text etc then fire the blur events
						if(!scope._actionRunning && $document[0].activeElement !== scope.displayElements.html[0] && $document[0].activeElement !== scope.displayElements.text[0]){
							element.removeClass(scope.classes.focussed);
							_toolbars.unfocus();
							// to prevent multiple apply error defer to next seems to work.
							$timeout(function(){ element.triggerHandler('blur'); }, 0);
						}
						e.preventDefault();
						return false;
					};
					scope.displayElements.html.on('blur', _focusout);
					scope.displayElements.text.on('blur', _focusout);

					// Setup the default toolbar tools, this way allows the user to add new tools like plugins.
					// This is on the editor for future proofing if we find a better way to do this.
					scope.queryFormatBlockState = function(command){
						// $document[0].queryCommandValue('formatBlock') errors in Firefox if we call this when focussed on the textarea
						return !scope.showHtml && command.toLowerCase() === $document[0].queryCommandValue('formatBlock').toLowerCase();
					};
					scope.queryCommandState = function(command){
						// $document[0].queryCommandValue('formatBlock') errors in Firefox if we call this when focussed on the textarea
						return (!scope.showHtml) ? $document[0].queryCommandState(command) : '';
					};
					scope.switchView = function(){
						scope.showHtml = !scope.showHtml;
						//Show the HTML view
						if(scope.showHtml){
							//defer until the element is visible
							$timeout(function(){
								// [0] dereferences the DOM object from the angular.element
								return scope.displayElements.html[0].focus();
							}, 100);
						}else{
							//Show the WYSIWYG view
							//defer until the element is visible
							$timeout(function(){
								// [0] dereferences the DOM object from the angular.element
								return scope.displayElements.text[0].focus();
							}, 100);
						}
					};

					// changes to the model variable from outside the html/text inputs
					// if no ngModel, then the only input is from inside text-angular
					if(attrs.ngModel){
						var _firstRun = true;
						ngModel.$render = function(){
							if(_firstRun){
								// we need this firstRun to set the originalContents otherwise it gets overrided by the setting of ngModel to undefined from NaN
								_firstRun = false;
								// if view value is null or undefined initially and there was original content, set to the original content
								var _initialValue = scope.$parent.$eval(attrs.ngModel);
								if((_initialValue === undefined || _initialValue === null) && (_originalContents && _originalContents !== '')){
									// on passing through to taBind it will be sanitised
									ngModel.$setViewValue(_originalContents);
								}
							}
							scope.displayElements.forminput.val(ngModel.$viewValue);
							// if the editors aren't focused they need to be updated, otherwise they are doing the updating
							/* istanbul ignore else: don't care */
							if(!scope._elementSelectTriggered && $document[0].activeElement !== scope.displayElements.html[0] && $document[0].activeElement !== scope.displayElements.text[0]){
								// catch model being null or undefined
								scope.html = ngModel.$viewValue || '';
							}
						};
						// trigger the validation calls
						var _validity = function(value){
							if(attrs.required) ngModel.$setValidity('required', !(!value || value.trim() === ''));
							return value;
						};
						ngModel.$parsers.push(_validity);
						ngModel.$formatters.push(_validity);
					}else{
						// if no ngModel then update from the contents of the origional html.
						scope.displayElements.forminput.val(_originalContents);
						scope.html = _originalContents;
					}

					// changes from taBind back up to here
					scope.$watch('html', function(newValue, oldValue){
						if(newValue !== oldValue){
							if(attrs.ngModel && ngModel.$viewValue !== newValue) ngModel.$setViewValue(newValue);
							scope.displayElements.forminput.val(newValue);
						}
					});

					if(attrs.taTargetToolbars) _toolbars = textAngularManager.registerEditor(_name, scope, attrs.taTargetToolbars.split(','));
					else{
						var _toolbar = angular.element('<div text-angular-toolbar name="textAngularToolbar' + _serial + '">');
						// passthrough init of toolbar options
						if(attrs.taToolbar)						_toolbar.attr('ta-toolbar', attrs.taToolbar);
						if(attrs.taToolbarClass)				_toolbar.attr('ta-toolbar-class', attrs.taToolbarClass);
						if(attrs.taToolbarGroupClass)			_toolbar.attr('ta-toolbar-group-class', attrs.taToolbarGroupClass);
						if(attrs.taToolbarButtonClass)			_toolbar.attr('ta-toolbar-button-class', attrs.taToolbarButtonClass);
						if(attrs.taToolbarActiveButtonClass)	_toolbar.attr('ta-toolbar-active-button-class', attrs.taToolbarActiveButtonClass);
						if(attrs.taFocussedClass)				_toolbar.attr('ta-focussed-class', attrs.taFocussedClass);

						element.prepend(_toolbar);
						$compile(_toolbar)(scope.$parent);
						_toolbars = textAngularManager.registerEditor(_name, scope, ['textAngularToolbar' + _serial]);
					}

					scope.$on('$destroy', function(){
						textAngularManager.unregisterEditor(_name);
					});

					// catch element select event and pass to toolbar tools
					scope.$on('ta-element-select', function(event, element){
						_toolbars.triggerElementSelect(event, element);
					});

					scope.$on('ta-drop-event', function(event, element, dropEvent, dataTransfer){
						scope.displayElements.text[0].focus();
						if(dataTransfer && dataTransfer.files && dataTransfer.files.length > 0){
							angular.forEach(dataTransfer.files, function(file){
								// taking advantage of boolean execution, if the fileDropHandler returns true, nothing else after it is executed
								// If it is false then execute the defaultFileDropHandler if the fileDropHandler is NOT the default one
								try{
									return scope.fileDropHandler(file, scope.wrapSelection) ||
										(scope.fileDropHandler !== scope.defaultFileDropHandler &&
										scope.defaultFileDropHandler(file, scope.wrapSelection));
								}catch(error){
									$log.error(error);
								}
							});
							dropEvent.preventDefault();
							dropEvent.stopPropagation();
						}
					});

					// the following is for applying the active states to the tools that support it
					scope._bUpdateSelectedStyles = false;
					// loop through all the tools polling their activeState function if it exists
					scope.updateSelectedStyles = function(){
						var _selection;
						// test if the common element ISN'T the root ta-text node
						if((_selection = taSelection.getSelectionElement()) !== undefined && _selection.parentNode !== scope.displayElements.text[0]){
							_toolbars.updateSelectedStyles(angular.element(_selection));
						}else _toolbars.updateSelectedStyles();
						// used to update the active state when a key is held down, ie the left arrow
						if(scope._bUpdateSelectedStyles) $timeout(scope.updateSelectedStyles, 200);
					};
					// start updating on keydown
					_keydown = function(){
						/* istanbul ignore else: don't run if already running */
						if(!scope._bUpdateSelectedStyles){
							scope._bUpdateSelectedStyles = true;
							scope.$apply(function(){
								scope.updateSelectedStyles();
							});
						}
					};
					scope.displayElements.html.on('keydown', _keydown);
					scope.displayElements.text.on('keydown', _keydown);
					// stop updating on key up and update the display/model
					_keyup = function(){
						scope._bUpdateSelectedStyles = false;
					};
					scope.displayElements.html.on('keyup', _keyup);
					scope.displayElements.text.on('keyup', _keyup);
					// stop updating on key up and update the display/model
					_keypress = function(event, eventData){
						/* istanbul ignore else: this is for catching the jqLite testing*/
						if(eventData) angular.extend(event, eventData);
						scope.$apply(function(){
							if(_toolbars.sendKeyCommand(event)){
								/* istanbul ignore else: don't run if already running */
								if(!scope._bUpdateSelectedStyles){
									scope.updateSelectedStyles();
								}
								event.preventDefault();
								return false;
							}
						});
					};
					scope.displayElements.html.on('keypress', _keypress);
					scope.displayElements.text.on('keypress', _keypress);
					// update the toolbar active states when we click somewhere in the text/html boxed
					_mouseup = function(){
						// ensure only one execution of updateSelectedStyles()
						scope._bUpdateSelectedStyles = false;
						scope.$apply(function(){
							scope.updateSelectedStyles();
						});
					};
					scope.displayElements.html.on('mouseup', _mouseup);
					scope.displayElements.text.on('mouseup', _mouseup);
				}
			};
		}
	]).factory('taBrowserTag', [function(){
		return function(tag){
			/* istanbul ignore next: ie specific test */
			if(!tag) return (ie <= 8)? 'P' : 'p';
			else if(tag === '') return (ie === undefined)? 'div' : (ie <= 8)? 'P' : 'p';
			else return (ie <= 8)? tag.toUpperCase() : tag;
		};
	}]).factory('taExecCommand', ['taSelection', 'taBrowserTag', '$document', function(taSelection, taBrowserTag, $document){
		var BLOCKELEMENTS = /^(address|article|aside|audio|blockquote|canvas|dd|div|dl|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|noscript|ol|output|p|pre|section|table|tfoot|ul|video)$/ig;
		var LISTELEMENTS = /^(ul|li|ol)$/ig;
		var listToDefault = function(listElement, defaultWrap){
			var $target, i;
			// if all selected then we should remove the list
			// grab all li elements and convert to taDefaultWrap tags
			var children = listElement.find('li');
			for(i = children.length - 1; i >= 0; i--){
				$target = angular.element('<' + defaultWrap + '>' + children[i].innerHTML + '</' + defaultWrap + '>');
				listElement.after($target);
			}
			listElement.remove();
			taSelection.setSelectionToElementEnd($target[0]);
		};
		var listToList = function(listElement, newListTag){
			var $target = angular.element('<' + newListTag + '>' + listElement[0].innerHTML + '</' + newListTag + '>');
			listElement.after($target);
			listElement.remove();
			taSelection.setSelectionToElementEnd($target.find('li')[0]);
		};
		var childElementsToList = function(elements, listElement, newListTag){
			var html = '';
			for(var i = 0; i < elements.length; i++){
				html += '<' + taBrowserTag('li') + '>' + elements[i].innerHTML + '</' + taBrowserTag('li') + '>';
			}
			var $target = angular.element('<' + newListTag + '>' + html + '</' + newListTag + '>');
			listElement.after($target);
			listElement.remove();
			taSelection.setSelectionToElementEnd($target.find('li')[0]);
		};
		return function(taDefaultWrap){
			taDefaultWrap = taBrowserTag(taDefaultWrap);
			return function(command, showUI, options){
				var i, $target, html, _nodes, next;
				var defaultWrapper = angular.element('<' + taDefaultWrap + '>');
				var selectedElement = taSelection.getSelectionElement();
				var $selected = angular.element(selectedElement);
				if(selectedElement !== undefined){
					var tagName = selectedElement.tagName.toLowerCase();
					if(command.toLowerCase() === 'insertorderedlist' || command.toLowerCase() === 'insertunorderedlist'){
						var selfTag = taBrowserTag((command.toLowerCase() === 'insertorderedlist')? 'ol' : 'ul');
						if(tagName === selfTag){
							// if all selected then we should remove the list
							// grab all li elements and convert to taDefaultWrap tags
							return listToDefault($selected, taDefaultWrap);
						}else if(tagName === 'li' && $selected.parent()[0].tagName.toLowerCase() === selfTag && $selected.parent().children().length === 1){
							// catch for the previous statement if only one li exists
							return listToDefault($selected.parent(), taDefaultWrap);
						}else if(tagName === 'li' && $selected.parent()[0].tagName.toLowerCase() !== selfTag && $selected.parent().children().length === 1){
							// catch for the previous statement if only one li exists
							return listToList($selected.parent(), selfTag);
						}else if(tagName.match(BLOCKELEMENTS) && !$selected.hasClass('ta-bind')){
							// if it's one of those block elements we have to change the contents
							// if it's a ol/ul we are changing from one to the other
							if(tagName === 'ol' || tagName === 'ul'){
								return listToList($selected, selfTag);
							}else{
								var childBlockElements = false;
								angular.forEach($selected.children(), function(elem){
									if(elem.tagName.match(BLOCKELEMENTS)) {
										childBlockElements = true;
									}
								});
								if(childBlockElements){
									return childElementsToList($selected.children(), $selected, selfTag);
								}else{
									return childElementsToList([angular.element('<div>' + selectedElement.innerHTML + '</div>')[0]], $selected, selfTag);
								}
							}
						}else if(tagName.match(BLOCKELEMENTS)){
							// if we get here then all the contents of the ta-bind are selected
							_nodes = taSelection.getOnlySelectedElements();
							if(_nodes.length === 1 && (_nodes[0].tagName.toLowerCase() === 'ol' || _nodes[0].tagName.toLowerCase() === 'ul')){
								if(_nodes[0].tagName.toLowerCase() === selfTag){
									// remove
									return listToDefault(angular.element(_nodes[0]), taDefaultWrap);
								}else{
									return listToList(angular.element(_nodes[0]), selfTag);
								}
							}else{
								html = '';
								var $nodes = [];
								for(i = 0; i < _nodes.length; i++){
									/* istanbul ignore else: catch for real-world can't make it occur in testing */
									if(_nodes[i].nodeType !== 3){
										var $n = angular.element(_nodes[i]);
										html += '<' + taBrowserTag('li') + '>' + $n[0].innerHTML + '</' + taBrowserTag('li') + '>';
										$nodes.unshift($n);
									}
								}
								$target = angular.element('<' + selfTag + '>' + html + '</' + selfTag + '>');
								$nodes.pop().replaceWith($target);
								angular.forEach($nodes, function($node){ $node.remove(); });
							}
							taSelection.setSelectionToElementEnd($target[0]);
							return;
						}
					}else if(command.toLowerCase() === 'formatblock'){
						var optionsTagName = options.toLowerCase().replace(/[<>]/ig, '');
						if(tagName === 'li') $target = $selected.parent();
						else $target = $selected;
						// find the first blockElement
						while(!$target[0].tagName.match(BLOCKELEMENTS)){
							$target = $target.parent();
							tagName = $target[0].tagName.toLowerCase();
						}
						if(tagName === optionsTagName){
							// $target is wrap element
							_nodes = $target.children();
							var hasBlock = false;
							for(i = 0; i < _nodes.length; i++){
								hasBlock = hasBlock || _nodes[i].tagName.match(BLOCKELEMENTS);
							}
							if(hasBlock){
								$target.after(_nodes);
								next = $target.next();
								$target.remove();
								$target = next;
							}else{
								defaultWrapper.append($target[0].childNodes);
								$target.after(defaultWrapper);
								$target.remove();
								$target = defaultWrapper;
							}
						}else if($target.parent()[0].tagName.toLowerCase() === optionsTagName && !$target.parent().hasClass('ta-bind')){
							//unwrap logic for parent
							var blockElement = $target.parent();
							var contents = blockElement.contents();
							for(i = 0; i < contents.length; i ++){
								/* istanbul ignore next: can't test - some wierd thing with how phantomjs works */
								if(blockElement.parent().hasClass('ta-bind') && contents[i].nodeType === 3){
									defaultWrapper = angular.element('<' + taDefaultWrap + '>');
									defaultWrapper[0].innerHTML = contents[i].outerHTML;
									contents[i] = defaultWrapper[0];
								}
								blockElement.parent()[0].insertBefore(contents[i], blockElement[0]);
							}
							blockElement.remove();
						}else if(tagName.match(LISTELEMENTS)){
							// wrapping a list element
							$target.wrap(options);
						}else{
							// default wrap behaviour
							_nodes = taSelection.getOnlySelectedElements();
							if(_nodes.length === 0) _nodes = [$target[0]];
							// find the parent block element if any of the nodes are inline or text
							var inlineNodePresent = false;
							angular.forEach(_nodes, function(node){
								if(node.nodeType === 3 || !node.tagName.match(BLOCKELEMENTS)){
									inlineNodePresent = true;
								}
							});
							if(inlineNodePresent){
								while(_nodes[0].nodeType === 3 || !_nodes[0].tagName.match(BLOCKELEMENTS)){
									_nodes = [_nodes[0].parentNode];
								}
							}
							if(angular.element(_nodes[0]).hasClass('ta-bind')){
								$target = angular.element(options);
								$target[0].innerHTML = _nodes[0].innerHTML;
								_nodes[0].innerHTML = $target[0].outerHTML;
							}else if(optionsTagName === 'blockquote'){
								// blockquotes wrap other block elements
								html = '';
								for(i = 0; i < _nodes.length; i++){
									html += _nodes[i].outerHTML;
								}
								$target = angular.element(options);
								$target[0].innerHTML = html;
								_nodes[0].parentNode.insertBefore($target[0],_nodes[0]);
								angular.forEach(_nodes, function(node){
									node.parentNode.removeChild(node);
								});
							}
							else {
								// regular block elements replace other block elements
								for(i = 0; i < _nodes.length; i++){
									$target = angular.element(options);
									$target[0].innerHTML = _nodes[i].innerHTML;
									_nodes[i].parentNode.insertBefore($target[0],_nodes[i]);
									_nodes[i].parentNode.removeChild(_nodes[i]);
								}
							}
						}
						taSelection.setSelectionToElementEnd($target[0]);
						return;
					}
				}
				try{
					$document[0].execCommand(command, showUI, options);
				}catch(e){}
			};
		};
	}]).directive('taBind', ['taSanitize', '$timeout', '$window', '$document', 'taFixChrome', 'taBrowserTag', 'taSelection', 'taSelectableElements', 'taApplyCustomRenderers', 'taOptions',
					function(taSanitize, $timeout, $window, $document, taFixChrome, taBrowserTag, taSelection, taSelectableElements, taApplyCustomRenderers, taOptions){
		// Uses for this are textarea or input with ng-model and ta-bind='text'
		// OR any non-form element with contenteditable="contenteditable" ta-bind="html|text" ng-model
		return {
			require: 'ngModel',
			scope: {},
			link: function(scope, element, attrs, ngModel){
				// the option to use taBind on an input or textarea is required as it will sanitize all input into it correctly.
				var _isContentEditable = element.attr('contenteditable') !== undefined && element.attr('contenteditable');
				var _isInputFriendly = _isContentEditable || element[0].tagName.toLowerCase() === 'textarea' || element[0].tagName.toLowerCase() === 'input';
				var _isReadonly = false;
				var _focussed = false;
				var _disableSanitizer = attrs.taUnsafeSanitizer || taOptions.disableSanitizer;
				
				// defaults to the paragraph element, but we need the line-break or it doesn't allow you to type into the empty element
				// non IE is '<p><br/></p>', ie is '<p></p>' as for once IE gets it correct...
				var _defaultVal, _defaultTest;
				// set the default to be a paragraph value
				if(attrs.taDefaultWrap === undefined) attrs.taDefaultWrap = 'p';
				/* istanbul ignore next: ie specific test */
				if(attrs.taDefaultWrap === ''){
					_defaultVal = '';
					_defaultTest = (ie === undefined)? '<div><br></div>' : (ie >= 11)? '<p><br></p>' : (ie <= 8)? '<P>&nbsp;</P>' : '<p>&nbsp;</p>';
				}else{
					_defaultVal = (ie === undefined || ie >= 11)?
						'<' + attrs.taDefaultWrap + '><br></' + attrs.taDefaultWrap + '>' :
						(ie <= 8)?
							'<' + attrs.taDefaultWrap.toUpperCase() + '></' + attrs.taDefaultWrap.toUpperCase() + '>' :
							'<' + attrs.taDefaultWrap + '></' + attrs.taDefaultWrap + '>';
					_defaultTest = (ie === undefined || ie >= 11)?
						'<' + attrs.taDefaultWrap + '><br></' + attrs.taDefaultWrap + '>' :
						(ie <= 8)?
							'<' + attrs.taDefaultWrap.toUpperCase() + '>&nbsp;</' + attrs.taDefaultWrap.toUpperCase() + '>' :
							'<' + attrs.taDefaultWrap + '>&nbsp;</' + attrs.taDefaultWrap + '>';
				}

				element.addClass('ta-bind');

				// in here we are undoing the converts used elsewhere to prevent the < > and & being displayed when they shouldn't in the code.
				var _compileHtml = function(){
					if(_isContentEditable) return element[0].innerHTML;
					if(_isInputFriendly) return element.val();
					throw ('textAngular Error: attempting to update non-editable taBind');
				};
				
				var _setViewValue = function(val){
					if(!val) val = _compileHtml();
					if(val === _defaultTest){
						// this avoids us from tripping the ng-pristine flag if we click in and out with out typing
						if(ngModel.$viewValue !== '') ngModel.$setViewValue('');
					}else{
						if(ngModel.$viewValue !== val) ngModel.$setViewValue(val);
					}
				};
				
				//used for updating when inserting wrapped elements
				scope.$parent['updateTaBind' + (attrs.id || '')] = function(){
					if(!_isReadonly) _setViewValue();
				};
				
				//this code is used to update the models when data is entered/deleted
				if(_isInputFriendly){
					if(!_isContentEditable){
						element.on('paste cut', function(){
							// timeout to next is needed as otherwise the paste/cut event has not finished actually changing the display
							if(!_isReadonly) $timeout(function(){
								ngModel.$setViewValue(_compileHtml());
							}, 0);
						});
						// if a textarea or input just add in change and blur handlers, everything else is done by angulars input directive
						element.on('change blur', function(){
							if(!_isReadonly) ngModel.$setViewValue(_compileHtml());
						});
					}else{
						element.on('cut', function(e){
							// timeout to next is needed as otherwise the paste/cut event has not finished actually changing the display
							if(!_isReadonly)
								$timeout(function(){
									_setViewValue();
								}, 0);
							else e.preventDefault();
						});
						element.on('paste', function(e, eventData){
							/* istanbul ignore else: this is for catching the jqLite testing*/
							if(eventData) angular.extend(e, eventData);
							var text;
							// for non-ie
							if(e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData))
								text = (e.originalEvent || e).clipboardData.getData('text/plain');
							// for ie
							else if($window.clipboardData)
								text = $window.clipboardData.getData('Text');
							// if theres non text data and we aren't in read-only do default
							if(!text && !_isReadonly) return true;
							// prevent the default paste command
							e.preventDefault();
							if(!_isReadonly){
								var _working = angular.element('<div></div>');
								_working[0].innerHTML = text;
								// this strips out all HTML tags
								text = _working.text();
								if ($document[0].selection){
									var range = $document[0].selection.createRange();
									range.pasteHTML(text);
								}
								else{
									$document[0].execCommand('insertText', false, text);
								}
								_setViewValue();
							}
						});

						// all the code specific to contenteditable divs
						element.on('keyup', function(event, eventData){
							/* istanbul ignore else: this is for catching the jqLite testing*/
							if(eventData) angular.extend(event, eventData);
							if(!_isReadonly){
								// if enter - insert new taDefaultWrap, if shift+enter insert <br/>
								if(_defaultVal !== '' && event.keyCode === 13){
									if(!event.shiftKey){
										// new paragraph, br should be caught correctly
										var selection = taSelection.getSelectionElement();
										if(selection.tagName.toLowerCase() !== attrs.taDefaultWrap && selection.tagName.toLowerCase() !== 'li' && (selection.innerHTML.trim() === '' || selection.innerHTML.trim() === '<br>')){
											var _new = angular.element(_defaultVal);
											angular.element(selection).replaceWith(_new);
											taSelection.setSelectionToElementStart(_new[0]);
										}
									}
								}
								var val = _compileHtml();
								if(_defaultVal !== '' && val.trim() === ''){
									element[0].innerHTML = _defaultVal;
									taSelection.setSelectionToElementStart(element.children()[0]);
								}
								_setViewValue(val);
							}
						});

						element.on('blur', function(){
							_focussed = false;
							/* istanbul ignore else: if readonly don't update model */
							if(!_isReadonly){
								_setViewValue();
							}
							ngModel.$render();
						});

						// Placeholders not supported on ie 8 and below
						if(attrs.placeholder && (ie > 8 || ie === undefined)){
							var ruleIndex;
							if(attrs.id) ruleIndex = addCSSRule('#' + attrs.id + '.placeholder-text:before', 'content: "' + attrs.placeholder + '"');
							else throw('textAngular Error: An unique ID is required for placeholders to work');

							scope.$on('$destroy', function(){
								removeCSSRule(ruleIndex);
							});
						}

						element.on('focus', function(){
							_focussed = true;
							ngModel.$render();
						});
						
						// prevent propagation on mousedown in editor, see #206
						element.on('mousedown', function(event, eventData){
							/* istanbul ignore else: this is for catching the jqLite testing*/
							if(eventData) angular.extend(event, eventData);
							event.stopPropagation(); 
						});
					}
				}
				
				// catch DOM XSS via taSanitize
				// Sanitizing both ways is identical
				var _sanitize = function(unsafe){
					return (ngModel.$oldViewValue = taSanitize(taFixChrome(unsafe), ngModel.$oldViewValue, _disableSanitizer));
				};
				
				// trigger the validation calls
				var _validity = function(value){
					if(attrs.required) ngModel.$setValidity('required', !(!value || value.trim() === _defaultTest || value.trim() === ''));
					return value;
				};
				// parsers trigger from the above keyup function or any other time that the viewValue is updated and parses it for storage in the ngModel
				ngModel.$parsers.push(_sanitize);
				ngModel.$parsers.push(_validity);
				// because textAngular is bi-directional (which is awesome) we need to also sanitize values going in from the server
				ngModel.$formatters.push(_sanitize);
				ngModel.$formatters.push(_validity);

				var selectorClickHandler = function(event){
					// emit the element-select event, pass the element
					scope.$emit('ta-element-select', this);
					event.preventDefault();
					return false;
				};
				var fileDropHandler = function(event, eventData){
					/* istanbul ignore else: this is for catching the jqLite testing*/
					if(eventData) angular.extend(event, eventData);
					// emit the drop event, pass the element, preventing should be done elsewhere
					if(!dropFired && !_isReadonly){
						dropFired = true;
						var dataTransfer;
						if(event.originalEvent) dataTransfer = event.originalEvent.dataTransfer;
						else dataTransfer = event.dataTransfer;
						scope.$emit('ta-drop-event', this, event, dataTransfer);
						$timeout(function(){dropFired = false;}, 100);
					}
				};

				//used for updating when inserting wrapped elements
				scope.$parent['reApplyOnSelectorHandlers' + (attrs.id || '')] = function(){
					/* istanbul ignore else */
					if(!_isReadonly) angular.forEach(taSelectableElements, function(selector){
							// check we don't apply the handler twice
							element.find(selector)
								.off('click', selectorClickHandler)
								.on('click', selectorClickHandler);
						});
				};
				
				var _setInnerHTML = function(newval){
					element[0].innerHTML = newval;
				};
				
				// changes to the model variable from outside the html/text inputs
				ngModel.$render = function(){
					// catch model being null or undefined
					var val = ngModel.$viewValue || '';
					// if the editor isn't focused it needs to be updated, otherwise it's receiving user input
					if($document[0].activeElement !== element[0]){
						// Not focussed
						if(_isContentEditable){
							// WYSIWYG Mode
							if(attrs.placeholder){
								if(val === ''){
									// blank
									if(_focussed) element.removeClass('placeholder-text');
									else element.addClass('placeholder-text');
									_setInnerHTML(_defaultVal);
								}else{
									// not-blank
									element.removeClass('placeholder-text');
									_setInnerHTML(val);
								}
							}else{
								_setInnerHTML((val === '') ? _defaultVal : val);
							}
							// if in WYSIWYG and readOnly we kill the use of links by clicking
							if(!_isReadonly){
								angular.forEach(taSelectableElements, function(selector){
									element.find(selector).on('click', selectorClickHandler);
								});
								element.on('drop', fileDropHandler);
							}else{
								element.off('drop', fileDropHandler);
							}
						}else if(element[0].tagName.toLowerCase() !== 'textarea' && element[0].tagName.toLowerCase() !== 'input'){
							// make sure the end user can SEE the html code as a display. This is a read-only display element
							_setInnerHTML(taApplyCustomRenderers(val));
						}else{
							// only for input and textarea inputs
							element.val(val);
						}
					}else{
						/* istanbul ignore else: in other cases we don't care */
						if(_isContentEditable){
							// element is focussed, test for placeholder
							element.removeClass('placeholder-text');
						}
					}
				};
				
				if(attrs.taReadonly){
					//set initial value
					_isReadonly = scope.$parent.$eval(attrs.taReadonly);
					if(_isReadonly){
						element.addClass('ta-readonly');
						// we changed to readOnly mode (taReadonly='true')
						if(element[0].tagName.toLowerCase() === 'textarea' || element[0].tagName.toLowerCase() === 'input'){
							element.attr('disabled', 'disabled');
						}
						if(element.attr('contenteditable') !== undefined && element.attr('contenteditable')){
							element.removeAttr('contenteditable');
						}
					}else{
						element.removeClass('ta-readonly');
						// we changed to NOT readOnly mode (taReadonly='false')
						if(element[0].tagName.toLowerCase() === 'textarea' || element[0].tagName.toLowerCase() === 'input'){
							element.removeAttr('disabled');
						}else if(_isContentEditable){
							element.attr('contenteditable', 'true');
						}
					}
					// taReadonly only has an effect if the taBind element is an input or textarea or has contenteditable='true' on it.
					// Otherwise it is readonly by default
					scope.$parent.$watch(attrs.taReadonly, function(newVal, oldVal){
						if(oldVal === newVal) return;
						if(newVal){
							element.addClass('ta-readonly');
							// we changed to readOnly mode (taReadonly='true')
							if(element[0].tagName.toLowerCase() === 'textarea' || element[0].tagName.toLowerCase() === 'input'){
								element.attr('disabled', 'disabled');
							}
							if(element.attr('contenteditable') !== undefined && element.attr('contenteditable')){
								element.removeAttr('contenteditable');
							}
							// turn ON selector click handlers
							angular.forEach(taSelectableElements, function(selector){
								element.find(selector).on('click', selectorClickHandler);
							});
							element.off('drop', fileDropHandler);
						}else{
							element.removeClass('ta-readonly');
							// we changed to NOT readOnly mode (taReadonly='false')
							if(element[0].tagName.toLowerCase() === 'textarea' || element[0].tagName.toLowerCase() === 'input'){
								element.removeAttr('disabled');
							}else if(_isContentEditable){
								element.attr('contenteditable', 'true');
							}
							// remove the selector click handlers
							angular.forEach(taSelectableElements, function(selector){
								element.find(selector).off('click', selectorClickHandler);
							});
							element.on('drop', fileDropHandler);
						}
						_isReadonly = newVal;
					});
				}

				// Initialise the selectableElements
				// if in WYSIWYG and readOnly we kill the use of links by clicking
				if(_isContentEditable && !_isReadonly){
					angular.forEach(taSelectableElements, function(selector){
						element.find(selector).on('click', selectorClickHandler);
					});
					element.on('drop', fileDropHandler);
					element.on('blur', function(){
						/* istanbul ignore next: webkit fix */
						if(/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)) { // detect webkit
							globalContentEditableBlur = true;
						}
					});
				}
			}
		};
	}]).factory('taApplyCustomRenderers', ['taCustomRenderers', function(taCustomRenderers){
		return function(val){
			var element = angular.element('<div></div>');
			element[0].innerHTML = val;

			angular.forEach(taCustomRenderers, function(renderer){
				var elements = [];
				// get elements based on what is defined. If both defined do secondary filter in the forEach after using selector string
				if(renderer.selector && renderer.selector !== '')
					elements = element.find(renderer.selector);
				/* istanbul ignore else: shouldn't fire, if it does we're ignoring everything */
				else if(renderer.customAttribute && renderer.customAttribute !== '')
					elements = getByAttribute(element, renderer.customAttribute);
				// process elements if any found
				angular.forEach(elements, function(_element){
					_element = angular.element(_element);
					if(renderer.selector && renderer.selector !== '' && renderer.customAttribute && renderer.customAttribute !== ''){
						if(_element.attr(renderer.customAttribute) !== undefined) renderer.renderLogic(_element);
					} else renderer.renderLogic(_element);
				});
			});

			return element[0].innerHTML;
		};
	}]).directive('taMaxText', function(){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl){
				var max = parseInt(scope.$eval(attrs.taMaxText));
				if (isNaN(max)){
					throw('Max text must be an integer');
				}
				attrs.$observe('taMaxText', function(value){
					max = parseInt(value);
					if (isNaN(max)){
						throw('Max text must be an integer');
					}
					if (ctrl.$dirty){
						ctrl.$setViewValue(ctrl.$viewValue);
					}
				});
				function validator (viewValue){
					var source = angular.element('<div/>');
					source.html(viewValue);
					var length = source.text().length;
					if (length <= max){
						ctrl.$setValidity('taMaxText', true);
						return viewValue;
					}
					else{
						ctrl.$setValidity('taMaxText', false);
						return undefined;
					}
				}
				ctrl.$parsers.unshift(validator);
			}
		};
	}).directive('taMinText', function(){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl){
				var min = parseInt(scope.$eval(attrs.taMinText));
				if (isNaN(min)){
					throw('Min text must be an integer');
				}
				attrs.$observe('taMinText', function(value){
					min = parseInt(value);
					if (isNaN(min)){
						throw('Min text must be an integer');
					}
					if (ctrl.$dirty){
						ctrl.$setViewValue(ctrl.$viewValue);
					}
				});
				function validator (viewValue){
					var source = angular.element('<div/>');
					source.html(viewValue);
					var length = source.text().length;
					if (!length || length >= min){
						ctrl.$setValidity('taMinText', true);
						return viewValue;
					}
					else{
						ctrl.$setValidity('taMinText', false);
						return undefined;
					}
				}
				ctrl.$parsers.unshift(validator);
			}
		};
	}).factory('taFixChrome', function(){
		// get whaterever rubbish is inserted in chrome
		// should be passed an html string, returns an html string
		var taFixChrome = function(html){
			// default wrapper is a span so find all of them
			var $html = angular.element('<div>' + html + '</div>');
			var spans = angular.element($html).find('span');
			for(var s = 0; s < spans.length; s++){
				var span = angular.element(spans[s]);
				// chrome specific string that gets inserted into the style attribute, other parts may vary. Second part is specific ONLY to hitting backspace in Headers
				if(span.attr('style') && span.attr('style').match(/line-height: 1.428571429;|color: inherit; line-height: 1.1;/i)){
					span.attr('style', span.attr('style').replace(/( |)font-family: inherit;|( |)line-height: 1.428571429;|( |)line-height:1.1;|( |)color: inherit;/ig, ''));
					if(!span.attr('style') || span.attr('style') === ''){
						if(span.next().length > 0 && span.next()[0].tagName === 'BR') span.next().remove();
						span.replaceWith(span[0].innerHTML);
					}
				}
			}
			// regex to replace ONLY offending styles - these can be inserted into various other tags on delete
			var result = $html[0].innerHTML.replace(/style="[^"]*?(line-height: 1.428571429;|color: inherit; line-height: 1.1;)[^"]*"/ig, '');
			// only replace when something has changed, else we get focus problems on inserting lists
			if(result !== $html[0].innerHTML) $html[0].innerHTML = result;
			return $html[0].innerHTML;
		};
		return taFixChrome;
	}).factory('taSanitize', ['$sanitize', function taSanitizeFactory($sanitize){
		return function taSanitize(unsafe, oldsafe, ignore){
			// unsafe and oldsafe should be valid HTML strings
			// any exceptions (lets say, color for example) should be made here but with great care
			// setup unsafe element for modification
			var unsafeElement = angular.element('<div>' + unsafe + '</div>');
			// replace all align='...' tags with text-align attributes
			angular.forEach(getByAttribute(unsafeElement, 'align'), function(element){
				element.css('text-align', element.attr('align'));
				element.removeAttr('align');
			});

			// get the html string back
			var safe;
			unsafe = unsafeElement[0].innerHTML;
			try {
				safe = $sanitize(unsafe);
				// do this afterwards, then the $sanitizer should still throw for bad markup
				if(ignore) safe = unsafe;
			} catch (e){
				safe = oldsafe || '';
			}
			return safe;
		};
	}]).directive('textAngularToolbar', [
		'$compile', 'textAngularManager', 'taOptions', 'taTools', 'taToolExecuteAction', '$window',
		function($compile, textAngularManager, taOptions, taTools, taToolExecuteAction, $window){
			return {
				scope: {
					name: '@' // a name IS required
				},
				restrict: "EA",
				link: function(scope, element, attrs){
					if(!scope.name || scope.name === '') throw('textAngular Error: A toolbar requires a name');
					angular.extend(scope, angular.copy(taOptions));
					if(attrs.taToolbar)						scope.toolbar = scope.$parent.$eval(attrs.taToolbar);
					if(attrs.taToolbarClass)				scope.classes.toolbar = attrs.taToolbarClass;
					if(attrs.taToolbarGroupClass)			scope.classes.toolbarGroup = attrs.taToolbarGroupClass;
					if(attrs.taToolbarButtonClass)			scope.classes.toolbarButton = attrs.taToolbarButtonClass;
					if(attrs.taToolbarActiveButtonClass)	scope.classes.toolbarButtonActive = attrs.taToolbarActiveButtonClass;
					if(attrs.taFocussedClass)				scope.classes.focussed = attrs.taFocussedClass;

					scope.disabled = true;
					scope.focussed = false;
					scope._$element = element;
					element[0].innerHTML = '';
					element.addClass("ta-toolbar " + scope.classes.toolbar);

					scope.$watch('focussed', function(){
						if(scope.focussed) element.addClass(scope.classes.focussed);
						else element.removeClass(scope.classes.focussed);
					});

					var setupToolElement = function(toolDefinition, toolScope){
						var toolElement;
						if(toolDefinition && toolDefinition.display){
							toolElement = angular.element(toolDefinition.display);
						}
						else toolElement = angular.element("<button type='button'>");

						toolElement.addClass(scope.classes.toolbarButton);
						toolElement.attr('name', toolScope.name);
						// important to not take focus from the main text/html entry
						toolElement.attr('unselectable', 'on');
						toolElement.attr('ng-disabled', 'isDisabled()');
						toolElement.attr('tabindex', '-1');
						toolElement.attr('ng-click', 'executeAction()');
						toolElement.attr('ng-class', 'displayActiveToolClass(active)');

						if (toolDefinition && toolDefinition.tooltiptext) {
							toolElement.attr('title', toolDefinition.tooltiptext);
						}

						toolElement.on('mousedown', function(e, eventData){
							/* istanbul ignore else: this is for catching the jqLite testing*/
							if(eventData) angular.extend(e, eventData);
							// this prevents focusout from firing on the editor when clicking toolbar buttons
							e.preventDefault();
							return false;
						});
						if(toolDefinition && !toolDefinition.display && !toolScope._display){
							// first clear out the current contents if any
							toolElement[0].innerHTML = '';
							// add the buttonText
							if(toolDefinition.buttontext) toolElement[0].innerHTML = toolDefinition.buttontext;
							// add the icon to the front of the button if there is content
							if(toolDefinition.iconclass){
								var icon = angular.element('<i>'), content = toolElement[0].innerHTML;
								icon.addClass(toolDefinition.iconclass);
								toolElement[0].innerHTML = '';
								toolElement.append(icon);
								if(content && content !== '') toolElement.append('&nbsp;' + content);
							}
						}

						toolScope._lastToolDefinition = angular.copy(toolDefinition);

						return $compile(toolElement)(toolScope);
					};

					// Keep a reference for updating the active states later
					scope.tools = {};
					// create the tools in the toolbar
					// default functions and values to prevent errors in testing and on init
					scope._parent = {
						disabled: true,
						showHtml: false,
						queryFormatBlockState: function(){ return false; },
						queryCommandState: function(){ return false; }
					};
					var defaultChildScope = {
						$window: $window,
						$editor: function(){
							// dynamically gets the editor as it is set
							return scope._parent;
						},
						isDisabled: function(){
							// to set your own disabled logic set a function or boolean on the tool called 'disabled'
							return ( // this bracket is important as without it it just returns the first bracket and ignores the rest
								// when the button's disabled function/value evaluates to true
								this.$eval('disabled') || this.$eval('disabled()') ||
								// all buttons except the HTML Switch button should be disabled in the showHtml (RAW html) mode
								(this.name !== 'html' && this.$editor().showHtml) ||
								// if the toolbar is disabled
								this.$parent.disabled ||
								// if the current editor is disabled
								this.$editor().disabled
							);
						},
						displayActiveToolClass: function(active){
							return (active)? scope.classes.toolbarButtonActive : '';
						},
						executeAction: taToolExecuteAction
					};

					angular.forEach(scope.toolbar, function(group){
						// setup the toolbar group
						var groupElement = angular.element("<div>");
						groupElement.addClass(scope.classes.toolbarGroup);
						angular.forEach(group, function(tool){
							// init and add the tools to the group
							// a tool name (key name from taTools struct)
							//creates a child scope of the main angularText scope and then extends the childScope with the functions of this particular tool
							// reference to the scope and element kept
							scope.tools[tool] = angular.extend(scope.$new(true), taTools[tool], defaultChildScope, {name: tool});
							scope.tools[tool].$element = setupToolElement(taTools[tool], scope.tools[tool]);
							// append the tool compiled with the childScope to the group element
							groupElement.append(scope.tools[tool].$element);
						});
						// append the group to the toolbar
						element.append(groupElement);
					});

					// update a tool
					// if a value is set to null, remove from the display
					// when forceNew is set to true it will ignore all previous settings, used to reset to taTools definition
					// to reset to defaults pass in taTools[key] as _newTool and forceNew as true, ie `updateToolDisplay(key, taTools[key], true);`
					scope.updateToolDisplay = function(key, _newTool, forceNew){
						var toolInstance = scope.tools[key];
						if(toolInstance){
							// get the last toolDefinition, then override with the new definition
							if(toolInstance._lastToolDefinition && !forceNew) _newTool = angular.extend({}, toolInstance._lastToolDefinition, _newTool);
							if(_newTool.buttontext === null && _newTool.iconclass === null && _newTool.display === null)
								throw('textAngular Error: Tool Definition for updating "' + key + '" does not have a valid display/iconclass/buttontext value');

							// if tool is defined on this toolbar, update/redo the tool
							if(_newTool.buttontext === null){
								delete _newTool.buttontext;
							}
							if(_newTool.iconclass === null){
								delete _newTool.iconclass;
							}
							if(_newTool.display === null){
								delete _newTool.display;
							}

							var toolElement = setupToolElement(_newTool, toolInstance);
							toolInstance.$element.replaceWith(toolElement);
							toolInstance.$element = toolElement;
						}
					};

					// we assume here that all values passed are valid and correct
					scope.addTool = function(key, _newTool, groupIndex, index){
						scope.tools[key] = angular.extend(scope.$new(true), taTools[key], defaultChildScope, {name: key});
						scope.tools[key].$element = setupToolElement(taTools[key], scope.tools[key]);
						var group;
						if(groupIndex === undefined) groupIndex = scope.toolbar.length - 1;
						group = angular.element(element.children()[groupIndex]);

						if(index === undefined){
							group.append(scope.tools[key].$element);
							scope.toolbar[groupIndex][scope.toolbar[groupIndex].length - 1] = key;
						}else{
							group.children().eq(index).after(scope.tools[key].$element);
							scope.toolbar[groupIndex][index] = key;
						}
					};

					textAngularManager.registerToolbar(scope);

					scope.$on('$destroy', function(){
						textAngularManager.unregisterToolbar(scope.name);
					});
				}
			};
		}
	]).service('taToolExecuteAction', ['$q', function($q){
		// this must be called on a toolScope or instance
		return function(editor){
			if(editor !== undefined) this.$editor = function(){ return editor; };
			var deferred = $q.defer(),
				promise = deferred.promise,
				_editor = this.$editor();
			promise['finally'](function(){
				_editor.endAction.call(_editor);
			});
			// pass into the action the deferred function and also the function to reload the current selection if rangy available
			var result;
			try{
				result = this.action(deferred, _editor.startAction());
			}catch(any){}
			if(result || result === undefined){
				// if true or undefined is returned then the action has finished. Otherwise the deferred action will be resolved manually.
				deferred.resolve();
			}
		};
	}]).service('textAngularManager', ['taToolExecuteAction', 'taTools', 'taRegisterTool', function(taToolExecuteAction, taTools, taRegisterTool){
		// this service is used to manage all textAngular editors and toolbars.
		// All publicly published functions that modify/need to access the toolbar or editor scopes should be in here
		// these contain references to all the editors and toolbars that have been initialised in this app
		var toolbars = {}, editors = {};
		// when we focus into a toolbar, we need to set the TOOLBAR's $parent to be the toolbars it's linked to.
		// We also need to set the tools to be updated to be the toolbars...
		return {
			// register an editor and the toolbars that it is affected by
			registerEditor: function(name, scope, targetToolbars){
				// targetToolbars are optional, we don't require a toolbar to function
				if(!name || name === '') throw('textAngular Error: An editor requires a name');
				if(!scope) throw('textAngular Error: An editor requires a scope');
				if(editors[name]) throw('textAngular Error: An Editor with name "' + name + '" already exists');
				// _toolbars is an ARRAY of toolbar scopes
				var _toolbars = [];
				angular.forEach(targetToolbars, function(_name){
					if(toolbars[_name]) _toolbars.push(toolbars[_name]);
					// if it doesn't exist it may not have been compiled yet and it will be added later
				});
				editors[name] = {
					scope: scope,
					toolbars: targetToolbars,
					_registerToolbar: function(toolbarScope){
						// add to the list late
						if(this.toolbars.indexOf(toolbarScope.name) >= 0) _toolbars.push(toolbarScope);
					},
					// this is a suite of functions the editor should use to update all it's linked toolbars
					editorFunctions: {
						disable: function(){
							// disable all linked toolbars
							angular.forEach(_toolbars, function(toolbarScope){ toolbarScope.disabled = true; });
						},
						enable: function(){
							// enable all linked toolbars
							angular.forEach(_toolbars, function(toolbarScope){ toolbarScope.disabled = false; });
						},
						focus: function(){
							// this should be called when the editor is focussed
							angular.forEach(_toolbars, function(toolbarScope){
								toolbarScope._parent = scope;
								toolbarScope.disabled = false;
								toolbarScope.focussed = true;
							});
						},
						unfocus: function(){
							// this should be called when the editor becomes unfocussed
							angular.forEach(_toolbars, function(toolbarScope){
								toolbarScope.disabled = true;
								toolbarScope.focussed = false;
							});
						},
						updateSelectedStyles: function(selectedElement){
							// update the active state of all buttons on liked toolbars
							angular.forEach(_toolbars, function(toolbarScope){
								angular.forEach(toolbarScope.tools, function(toolScope){
									if(toolScope.activeState){
										toolScope.active = toolScope.activeState(selectedElement);
									}
								});
							});
						},
						sendKeyCommand: function(event){
							// we return true if we applied an action, false otherwise
							var result = false;
							if(event.ctrlKey || event.metaKey) angular.forEach(taTools, function(tool, name){
								if(tool.commandKeyCode && tool.commandKeyCode === event.which){
									for(var _t = 0; _t < _toolbars.length; _t++){
										if(_toolbars[_t].tools[name] !== undefined){
											taToolExecuteAction.call(_toolbars[_t].tools[name], scope);
											result = true;
											break;
										}
									}
								}
							});
							return result;
						},
						triggerElementSelect: function(event, element){
							// search through the taTools to see if a match for the tag is made.
							// if there is, see if the tool is on a registered toolbar and not disabled.
							// NOTE: This can trigger on MULTIPLE tools simultaneously.
							var elementHasAttrs = function(_element, attrs){
								var result = true;
								for(var i = 0; i < attrs.length; i++) result = result && _element.attr(attrs[i]);
								return result;
							};
							var workerTools = [];
							var unfilteredTools = {};
							var result = false;
							element = angular.element(element);
							// get all valid tools by element name, keep track if one matches the
							var onlyWithAttrsFilter = false;
							angular.forEach(taTools, function(tool, name){
								if(
									tool.onElementSelect &&
									tool.onElementSelect.element &&
									tool.onElementSelect.element.toLowerCase() === element[0].tagName.toLowerCase() &&
									(!tool.onElementSelect.filter || tool.onElementSelect.filter(element))
								){
									// this should only end up true if the element matches the only attributes
									onlyWithAttrsFilter = onlyWithAttrsFilter ||
										(angular.isArray(tool.onElementSelect.onlyWithAttrs) && elementHasAttrs(element, tool.onElementSelect.onlyWithAttrs));
									if(!tool.onElementSelect.onlyWithAttrs || elementHasAttrs(element, tool.onElementSelect.onlyWithAttrs)) unfilteredTools[name] = tool;
								}
							});
							// if we matched attributes to filter on, then filter, else continue
							if(onlyWithAttrsFilter){
								angular.forEach(unfilteredTools, function(tool, name){
									if(tool.onElementSelect.onlyWithAttrs && elementHasAttrs(element, tool.onElementSelect.onlyWithAttrs)) workerTools.push({'name': name, 'tool': tool});
								});
								// sort most specific (most attrs to find) first
								workerTools.sort(function(a,b){
									return b.tool.onElementSelect.onlyWithAttrs.length - a.tool.onElementSelect.onlyWithAttrs.length;
								});
							}else{
								angular.forEach(unfilteredTools, function(tool, name){
									workerTools.push({'name': name, 'tool': tool});
								});
							}
							// Run the actions on the first visible filtered tool only
							if(workerTools.length > 0){
								for(var _i = 0; _i < workerTools.length; _i++){
									var tool = workerTools[_i].tool;
									var name = workerTools[_i].name;
									for(var _t = 0; _t < _toolbars.length; _t++){
										if(_toolbars[_t].tools[name] !== undefined){
											tool.onElementSelect.action.call(_toolbars[_t].tools[name], event, element, scope);
											result = true;
											break;
										}
									}
									if(result) break; 
								}
							}
							return result;
						}
					}
				};
				return editors[name].editorFunctions;
			},
			// retrieve editor by name, largely used by testing suites only
			retrieveEditor: function(name){
				return editors[name];
			},
			unregisterEditor: function(name){
				delete editors[name];
			},
			// registers a toolbar such that it can be linked to editors
			registerToolbar: function(scope){
				if(!scope) throw('textAngular Error: A toolbar requires a scope');
				if(!scope.name || scope.name === '') throw('textAngular Error: A toolbar requires a name');
				if(toolbars[scope.name]) throw('textAngular Error: A toolbar with name "' + scope.name + '" already exists');
				toolbars[scope.name] = scope;
				angular.forEach(editors, function(_editor){
					_editor._registerToolbar(scope);
				});
			},
			// retrieve toolbar by name, largely used by testing suites only
			retrieveToolbar: function(name){
				return toolbars[name];
			},
			// retrieve toolbars by editor name, largely used by testing suites only
			retrieveToolbarsViaEditor: function(name){
				var result = [], _this = this;
				angular.forEach(this.retrieveEditor(name).toolbars, function(name){
					result.push(_this.retrieveToolbar(name));
				});
				return result;
			},
			unregisterToolbar: function(name){
				delete toolbars[name];
			},
			// functions for updating the toolbar buttons display
			updateToolsDisplay: function(newTaTools){
				// pass a partial struct of the taTools, this allows us to update the tools on the fly, will not change the defaults.
				var _this = this;
				angular.forEach(newTaTools, function(_newTool, key){
					_this.updateToolDisplay(key, _newTool);
				});
			},
			// this function resets all toolbars to their default tool definitions
			resetToolsDisplay: function(){
				var _this = this;
				angular.forEach(taTools, function(_newTool, key){
					_this.resetToolDisplay(key);
				});
			},
			// update a tool on all toolbars
			updateToolDisplay: function(toolKey, _newTool){
				var _this = this;
				angular.forEach(toolbars, function(toolbarScope, toolbarKey){
					_this.updateToolbarToolDisplay(toolbarKey, toolKey, _newTool);
				});
			},
			// resets a tool to the default/starting state on all toolbars
			resetToolDisplay: function(toolKey){
				var _this = this;
				angular.forEach(toolbars, function(toolbarScope, toolbarKey){
					_this.resetToolbarToolDisplay(toolbarKey, toolKey);
				});
			},
			// update a tool on a specific toolbar
			updateToolbarToolDisplay: function(toolbarKey, toolKey, _newTool){
				if(toolbars[toolbarKey]) toolbars[toolbarKey].updateToolDisplay(toolKey, _newTool);
				else throw('textAngular Error: No Toolbar with name "' + toolbarKey + '" exists');
			},
			// reset a tool on a specific toolbar to it's default starting value
			resetToolbarToolDisplay: function(toolbarKey, toolKey){
				if(toolbars[toolbarKey]) toolbars[toolbarKey].updateToolDisplay(toolKey, taTools[toolKey], true);
				else throw('textAngular Error: No Toolbar with name "' + toolbarKey + '" exists');
			},
			// removes a tool from all toolbars and it's definition
			removeTool: function(toolKey){
				delete taTools[toolKey];
				angular.forEach(toolbars, function(toolbarScope){
					delete toolbarScope.tools[toolKey];
					for(var i = 0; i < toolbarScope.toolbar.length; i++){
						var toolbarIndex;
						for(var j = 0; j < toolbarScope.toolbar[i].length; j++){
							if(toolbarScope.toolbar[i][j] === toolKey){
								toolbarIndex = {
									group: i,
									index: j
								};
								break;
							}
							if(toolbarIndex !== undefined) break;
						}
						if(toolbarIndex !== undefined){
							toolbarScope.toolbar[toolbarIndex.group].slice(toolbarIndex.index, 1);
							toolbarScope._$element.children().eq(toolbarIndex.group).children().eq(toolbarIndex.index).remove();
						}
					}
				});
			},
			// toolkey, toolDefinition are required. If group is not specified will pick the last group, if index isnt defined will append to group
			addTool: function(toolKey, toolDefinition, group, index){
				taRegisterTool(toolKey, toolDefinition);
				angular.forEach(toolbars, function(toolbarScope){
					toolbarScope.addTool(toolKey, toolDefinition, group, index);
				});
			},
			// adds a Tool but only to one toolbar not all
			addToolToToolbar: function(toolKey, toolDefinition, toolbarKey, group, index){
				taRegisterTool(toolKey, toolDefinition);
				toolbars[toolbarKey].addTool(toolKey, toolDefinition, group, index);
			},
			// this is used when externally the html of an editor has been changed and textAngular needs to be notified to update the model.
			// this will call a $digest if not already happening
			refreshEditor: function(name){
				if(editors[name]){
					editors[name].scope.updateTaBindtaTextElement();
					/* istanbul ignore else: phase catch */
					if(!editors[name].scope.$$phase) editors[name].scope.$digest();
				}else throw('textAngular Error: No Editor with name "' + name + '" exists');
			}
		};
	}]).service('taSelection', ['$window', '$document',
	/* istanbul ignore next: all browser specifics and PhantomJS dosen't seem to support half of it */
	function($window, $document){
		// need to dereference the document else the calls don't work correctly
		var _document = $document[0];
		var nextNode = function(node) {
			if (node.hasChildNodes()) {
				return node.firstChild;
			} else {
				while (node && !node.nextSibling) {
					node = node.parentNode;
				}
				if (!node) {
					return null;
				}
				return node.nextSibling;
			}
		};
		var getRangeSelectedNodes = function(range) {
			var node = range.startContainer;
			var endNode = range.endContainer;

			// Special case for a range that is contained within a single node
			if (node === endNode) {
				return [node];
			}
			// Iterate nodes until we hit the end container
			var rangeNodes = [];
			while (node && node !== endNode) {
				node = nextNode(node);
				if(node.parentNode === range.commonAncestorContainer) rangeNodes.push(node);
			}
			// Add partially selected nodes at the start of the range
			node = range.startContainer;
			while (node && node !== range.commonAncestorContainer) {
				if(node.parentNode === range.commonAncestorContainer) rangeNodes.unshift(node);
				node = node.parentNode;
			}
			return rangeNodes;
		};
		return {
			getOnlySelectedElements: function(){
				if (window.getSelection) {
					var sel = $window.getSelection();
					if (!sel.isCollapsed) {
						return getRangeSelectedNodes(sel.getRangeAt(0));
					}
				}
				return [];
			},
			// Some basic selection functions
			getSelectionElement: function () {
				var range, sel, container;
				if (_document.selection && _document.selection.createRange) {
					// IE case
					range = _document.selection.createRange();
					return range.parentElement();
				} else if ($window.getSelection) {
					sel = $window.getSelection();
					if (sel.getRangeAt) {
						if (sel.rangeCount > 0) {
							range = sel.getRangeAt(0);
						}
					} else {
						// Old WebKit selection object has no getRangeAt, so
						// create a range from other selection properties
						range = _document.createRange();
						range.setStart(sel.anchorNode, sel.anchorOffset);
						range.setEnd(sel.focusNode, sel.focusOffset);

						// Handle the case when the selection was selected backwards (from the end to the start in the document)
						if (range.collapsed !== sel.isCollapsed) {
							range.setStart(sel.focusNode, sel.focusOffset);
							range.setEnd(sel.anchorNode, sel.anchorOffset);
						}
					}

					if (range) {
						container = range.commonAncestorContainer;

						// Check if the container is a text node and return its parent if so
						return container.nodeType === 3 ? container.parentNode : container;
					}
				}
			},
			setSelectionToElementStart: function (el){
				if (_document.createRange && $window.getSelection) {
					var range = _document.createRange();
					range.selectNodeContents(el);
					range.setStart(el, 0);
					range.setEnd(el, 0);

					var sel = $window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (_document.selection && _document.body.createTextRange) {
					var textRange = _document.body.createTextRange();
					textRange.moveToElementText(el);
					textRange.collapse(true);
					textRange.moveEnd("character", 0);
					textRange.moveStart("character", 0);
					textRange.select();
				}
			},
			setSelectionToElementEnd: function (el){
				if (_document.createRange && $window.getSelection) {
					var range = _document.createRange();
					range.selectNodeContents(el);
					range.collapse(false);

					var sel = $window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (_document.selection && _document.body.createTextRange) {
					var textRange = _document.body.createTextRange();
					textRange.moveToElementText(el);
					textRange.collapse(false);
					textRange.select();
				}
			}
		};
	}]);
})();

/**
 * @license AngularJS v1.3.0-build.2711+sha.facd904
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $sanitizeMinErr = angular.$$minErr('$sanitize');

/**
 * @ngdoc module
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */


/**
 * @ngdoc service
 * @name $sanitize
 * @function
 *
 * @description
 *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however, since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer.
 *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
 *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
 *
 * @param {string} html Html input.
 * @returns {string} Sanitized html.
 *
 * @example
   <example module="ngSanitize" deps="angular-sanitize.js">
   <file name="index.html">
     <script>
       function Ctrl($scope, $sce) {
         $scope.snippet =
           '<p style="color:blue">an html\n' +
           '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
           'snippet</p>';
         $scope.deliberatelyTrustDangerousSnippet = function() {
           return $sce.trustAsHtml($scope.snippet);
         };
       }
     </script>
     <div ng-controller="Ctrl">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </file>
   </example>
 */
function $SanitizeProvider() {
  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
    return function(html) {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
        return !/^unsafe/.test($$sanitizeUri(uri, isImage));
      }));
      return buf.join('');
    };
  }];
}

function sanitizeText(chars) {
  var buf = [];
  var writer = htmlSanitizeWriter(buf, angular.noop);
  writer.chars(chars);
  return buf.join('');
}


// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP =
       /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
  END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\s*\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    optionalEndTagInlineElements = makeMap("rp,rt"),
    optionalEndTagElements = angular.extend({},
                                            optionalEndTagInlineElements,
                                            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
var specialElements = makeMap("script,style");

var validElements = angular.extend({},
                                   voidElements,
                                   blockElements,
                                   inlineElements,
                                   optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
var validAttrs = angular.extend({}, uriAttrs, makeMap(
    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
    'scope,scrolling,shape,size,span,start,summary,target,title,type,'+
    'valign,value,vspace,width'));

function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) obj[items[i]] = true;
  return obj;
}


/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser( html, handler ) {
  var index, chars, match, stack = [], last = html;
  stack.last = function() { return stack[ stack.length - 1 ]; };

  while ( html ) {
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        // comments containing -- are not allowed unless they terminate the comment
        index = html.indexOf("--", 4);

        if ( index >= 0 && html.lastIndexOf("-->", index) === index) {
          if (handler.comment) handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }
      // DOCTYPE
      } else if ( DOCTYPE_REGEXP.test(html) ) {
        match = html.match( DOCTYPE_REGEXP );

        if ( match ) {
          html = html.replace( match[0], '');
          chars = false;
        }
      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( START_TAG_REGEXP, parseStartTag );
          chars = false;
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        var text = index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        if (handler.chars) handler.chars( decodeEntities(text) );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
        function(all, text){
          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

          if (handler.chars) handler.chars( decodeEntities(text) );

          return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                                        "of html: {0}", html);
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = angular.lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = voidElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    var attrs = {};

    rest.replace(ATTR_REGEXP,
      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
        var value = doubleQuotedValue
          || singleQuotedValue
          || unquotedValue
          || '';

        attrs[name] = decodeEntities(value);
    });
    if (handler.start) handler.start( tagName, attrs, unary );
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = angular.lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        if (handler.end) handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

var hiddenPre=document.createElement("pre");
var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 */
function decodeEntities(value) {
  if (!value) { return ''; }

  // Note: IE8 does not preserve spaces at the start/end of innerHTML
  // so we must capture them and reattach them afterward
  var parts = spaceRe.exec(value);
  var spaceBefore = parts[1];
  var spaceAfter = parts[3];
  var content = parts[2];
  if (content) {
    hiddenPre.innerHTML=content.replace(/</g,"&lt;");
    // innerText depends on styling as it doesn't display hidden elements.
    // Therefore, it's better to use textContent not to cause unnecessary
    // reflows. However, IE<9 don't support textContent so the innerText
    // fallback is necessary.
    content = 'textContent' in hiddenPre ?
      hiddenPre.textContent : hiddenPre.innerText;
  }
  return spaceBefore + content + spaceAfter;
}

/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns {string} escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(SURROGATE_PAIR_REGEXP, function (value) {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      // unsafe chars are: \u0000-\u001f \u007f-\u009f \u00ad \u0600-\u0604 \u070f \u17b4 \u17b5 \u200c-\u200f \u2028-\u202f \u2060-\u206f \ufeff \ufff0-\uffff from jslint.com/lint.html
      // decimal values are: 0-31, 127-159, 173, 1536-1540, 1807, 6068, 6069, 8204-8207, 8232-8239, 8288-8303, 65279, 65520-65535
      var c = value.charCodeAt(0);
      // if unsafe character encode
      if(c <= 159 ||
        c == 173 ||
        (c >= 1536 && c <= 1540) ||
        c == 1807 ||
        c == 6068 ||
        c == 6069 ||
        (c >= 8204 && c <= 8207) ||
        (c >= 8232 && c <= 8239) ||
        (c >= 8288 && c <= 8303) ||
        c == 65279 ||
        (c >= 65520 && c <= 65535)) return '&#' + c + ';';
      return value; // avoids multilingual issues
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

var trim = (function() {
  // native trim is way faster: http://jsperf.com/angular-trim-test
  // but IE doesn't have it... :-(
  // TODO: we should move this into IE/ES5 polyfill
  if (!String.prototype.trim) {
    return function(value) {
      return angular.isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
    };
  }
  return function(value) {
    return angular.isString(value) ? value.trim() : value;
  };
})();

// Custom logic for accepting certain style options only - textAngular
// Currently allows only the color attribute, all other attributes should be easily done through classes.
function validStyles(styleAttr){
	var result = '';
	var styleArray = styleAttr.split(';');
	angular.forEach(styleArray, function(value){
		var v = value.split(':');
		if(v.length == 2){
			var key = trim(angular.lowercase(v[0]));
			var value = trim(angular.lowercase(v[1]));
			if(
				key === 'color' && (
					value.match(/^rgb\([0-9%,\. ]*\)$/i)
					|| value.match(/^rgba\([0-9%,\. ]*\)$/i)
					|| value.match(/^hsl\([0-9%,\. ]*\)$/i)
					|| value.match(/^hsla\([0-9%,\. ]*\)$/i)
					|| value.match(/^#[0-9a-f]{3,6}$/i)
					|| value.match(/^[a-z]*$/i)
				)
			||
				key === 'text-align' && (
					value === 'left'
					|| value === 'right'
					|| value === 'center'
					|| value === 'justify'
				)
			||
				key === 'float' && (
					value === 'left'
					|| value === 'right'
					|| value === 'none'
				)
			||
				(key === 'width' || key === 'height') && (
					value.match(/[0-9\.]*(px|em|rem|%)/)
				)
			) result += key + ': ' + value + ';';
		}
	});
	return result;
}

// this function is used to manually allow specific attributes on specific tags with certain prerequisites
function validCustomTag(tag, attrs, lkey, value){
	// catch the div placeholder for the iframe replacement
    if (tag === 'img' && attrs['ta-insert-video']){
        if(lkey === 'ta-insert-video' || lkey === 'allowfullscreen' || lkey === 'frameborder' || (lkey === 'contenteditble' && value === 'false')) return true;
    }
    return false;
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf, uriValidator){
  var ignore = false;
  var out = angular.bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = angular.lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] === true) {
        out('<');
        out(tag);
        angular.forEach(attrs, function(value, key){
          var lkey=angular.lowercase(key);
          var isImage=(tag === 'img' && lkey === 'src') || (lkey === 'background');
          if ((lkey === 'style' && (value = validStyles(value)) !== '') || validCustomTag(tag, attrs, lkey, value) || validAttrs[lkey] === true &&
            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = angular.lowercase(tag);
        if (!ignore && validElements[tag] === true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}


// define ngSanitize module and register $sanitize service
angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

/* global sanitizeText: false */

/**
 * @ngdoc filter
 * @name linky
 * @function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
 * @returns {string} Html-linkified text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <example module="ngSanitize" deps="angular-sanitize.js">
     <file name="index.html">
       <script>
         function Ctrl($scope) {
           $scope.snippet =
             'Pretty text with some links:\n'+
             'http://angularjs.org/,\n'+
             'mailto:us@somewhere.org,\n'+
             'another@somewhere.org,\n'+
             'and one more: ftp://127.0.0.1/.';
           $scope.snippetWithTarget = 'http://angularjs.org/';
         }
       </script>
       <div ng-controller="Ctrl">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Filter</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </file>
     <file name="protractor.js" type="protractor">
       it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
       });

       it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
       });

       it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });
     </file>
   </example>
 */
angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,
      MAILTO_REGEXP = /^mailto:/;

  return function(text, target) {
    if (!text) return text;
    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/mailto then assume mailto
      if (match[2] == match[3]) url = 'mailto:' + url;
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(sanitizeText(text));
    }

    function addLink(url, text) {
      html.push('<a ');
      if (angular.isDefined(target)) {
        html.push('target="');
        html.push(target);
        html.push('" ');
      }
      html.push('href="');
      html.push(url);
      html.push('">');
      addText(text);
      html.push('</a>');
    }
  };
}]);


})(window, window.angular);

/*
textAngular
Author : Austin Anderson
License : 2013 MIT
Version 1.2.2

See README.md or https://github.com/fraywing/textAngular/wiki for requirements and use.
*/
angular.module('textAngularSetup', [])
	
// Here we set up the global display defaults, to set your own use a angular $provider#decorator.
.value('taOptions',  {
	toolbar: [
		['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
		['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
		['justifyLeft','justifyCenter','justifyRight','indent','outdent'],
		['html', 'insertImage', 'insertLink', 'insertVideo']
	],
	classes: {
		focussed: "focussed",
		toolbar: "btn-toolbar",
		toolbarGroup: "btn-group",
		toolbarButton: "btn btn-default",
		toolbarButtonActive: "active",
		disabled: "disabled",
		textEditor: 'form-control',
		htmlEditor: 'form-control'
	},
	setup: {
		// wysiwyg mode
		textEditorSetup: function($element){ /* Do some processing here */ },
		// raw html
		htmlEditorSetup: function($element){ /* Do some processing here */ }
	},
	defaultFileDropHandler:
		/* istanbul ignore next: untestable image processing */
		function(file, insertAction){
			var reader = new FileReader();
			if(file.type.substring(0, 5) === 'image'){
				reader.onload = function() {
					if(reader.result !== '') insertAction('insertImage', reader.result, true);
				};

				reader.readAsDataURL(file);
				return true;
			}
			return false;
		}
})

// This is the element selector string that is used to catch click events within a taBind, prevents the default and $emits a 'ta-element-select' event
// these are individually used in an angular.element().find() call. What can go here depends on whether you have full jQuery loaded or just jQLite with angularjs.
// div is only used as div.ta-insert-video caught in filter.
.value('taSelectableElements', ['a','img'])

// This is an array of objects with the following options:
//				selector: <string> a jqLite or jQuery selector string
//				customAttribute: <string> an attribute to search for
//				renderLogic: <function(element)>
// Both or one of selector and customAttribute must be defined.
.value('taCustomRenderers', [
	{
		// Parse back out: '<div class="ta-insert-video" ta-insert-video src="' + urlLink + '" allowfullscreen="true" width="300" frameborder="0" height="250"></div>'
		// To correct video element. For now only support youtube
		selector: 'img',
		customAttribute: 'ta-insert-video',
		renderLogic: function(element){
			var iframe = angular.element('<iframe></iframe>');
			var attributes = element.prop("attributes");
			// loop through element attributes and apply them on iframe
			angular.forEach(attributes, function(attr) {
				iframe.attr(attr.name, attr.value);
			});
			iframe.attr('src', iframe.attr('ta-insert-video'));
			element.replaceWith(iframe);
		}
	}
])

.constant('taTranslations', {
	// moved to sub-elements
	//toggleHTML: "Toggle HTML",
	//insertImage: "Please enter a image URL to insert",
	//insertLink: "Please enter a URL to insert",
	//insertVideo: "Please enter a youtube URL to embed",
	html: {
		buttontext: 'Toggle HTML',
		tooltip: 'Toggle html / Rich Text'
	},
	// tooltip for heading - might be worth splitting
	heading: {
		tooltip: 'Heading '
	},
	p: {
		tooltip: 'Paragraph'
	},
	pre: {
		tooltip: 'Preformatted text'
	},
	ul: {
		tooltip: 'Unordered List'
	},
	ol: {
		tooltip: 'Ordered List'
	},
	quote: {
		tooltip: 'Quote/unqoute selection or paragraph'
	},
	undo: {
		tooltip: 'Undo'
	},
	redo: {
		tooltip: 'Redo'
	},
	bold: {
		tooltip: 'Bold'
	},
	italic: {
		tooltip: 'Italic'
	},
	underline: {
		tooltip: 'Underline'
	},
	justifyLeft: {
		tooltip: 'Align text left'
	},
	justifyRight: {
		tooltip: 'Align text right'
	},
	justifyCenter: {
		tooltip: 'Center'
	},
	indent: {
		tooltip: 'Increase indent'
	},
	outdent: {
		tooltip: 'Decrease indent'
	},
	clear: {
		tooltip: 'Clear formatting'
	},
	insertImage: {
		dialogPrompt: 'Please enter an image URL to insert',
		tooltip: 'Insert image',
		hotkey: 'the - possibly language dependent hotkey ... for some future implementation'
	},
	insertVideo: {
		tooltip: 'Insert video',
		dialogPrompt: 'Please enter a youtube URL to embed'
	},
	insertLink: {
		tooltip: 'Insert / edit link',
		dialogPrompt: "Please enter a URL to insert"
	}
})
.run(['taRegisterTool', '$window', 'taTranslations', 'taSelection', function(taRegisterTool, $window, taTranslations, taSelection){
	taRegisterTool("html", {
		buttontext: taTranslations.html.buttontext,
		tooltiptext: taTranslations.html.tooltip,
		action: function(){
			this.$editor().switchView();
		},
		activeState: function(){
			return this.$editor().showHtml;
		}
	});
	// add the Header tools
	// convenience functions so that the loop works correctly
	var _retActiveStateFunction = function(q){
		return function(){ return this.$editor().queryFormatBlockState(q); };
	};
	var headerAction = function(){
		return this.$editor().wrapSelection("formatBlock", "<" + this.name.toUpperCase() +">");
	};
	angular.forEach(['h1','h2','h3','h4','h5','h6'], function(h){
		taRegisterTool(h.toLowerCase(), {
			buttontext: h.toUpperCase(),
			tooltiptext: taTranslations.heading.tooltip + h.charAt(1),
			action: headerAction,
			activeState: _retActiveStateFunction(h.toLowerCase())
		});
	});
	taRegisterTool('p', {
		buttontext: 'P',
		tooltiptext: taTranslations.p.tooltip,
		action: function(){
			return this.$editor().wrapSelection("formatBlock", "<P>");
		},
		activeState: function(){ return this.$editor().queryFormatBlockState('p'); }
	});
	// key: pre -> taTranslations[key].tooltip, taTranslations[key].buttontext
	taRegisterTool('pre', {
		buttontext: 'pre',
		tooltiptext: taTranslations.pre.tooltip,
		action: function(){
			return this.$editor().wrapSelection("formatBlock", "<PRE>");
		},
		activeState: function(){ return this.$editor().queryFormatBlockState('pre'); }
	});
	taRegisterTool('ul', {
		iconclass: 'fa fa-list-ul',
		tooltiptext: taTranslations.ul.tooltip,
		action: function(){
			return this.$editor().wrapSelection("insertUnorderedList", null);
		},
		activeState: function(){ return this.$editor().queryCommandState('insertUnorderedList'); }
	});
	taRegisterTool('ol', {
		iconclass: 'fa fa-list-ol',
		tooltiptext: taTranslations.ol.tooltip,
		action: function(){
			return this.$editor().wrapSelection("insertOrderedList", null);
		},
		activeState: function(){ return this.$editor().queryCommandState('insertOrderedList'); }
	});
	taRegisterTool('quote', {
		iconclass: 'fa fa-quote-right',
		tooltiptext: taTranslations.quote.tooltip,
		action: function(){
			return this.$editor().wrapSelection("formatBlock", "<BLOCKQUOTE>");
		},
		activeState: function(){ return this.$editor().queryFormatBlockState('blockquote'); }
	});
	taRegisterTool('undo', {
		iconclass: 'fa fa-undo',
		tooltiptext: taTranslations.undo.tooltip,
		action: function(){
			return this.$editor().wrapSelection("undo", null);
		}
	});
	taRegisterTool('redo', {
		iconclass: 'fa fa-repeat',
		tooltiptext: taTranslations.redo.tooltip,
		action: function(){
			return this.$editor().wrapSelection("redo", null);
		}
	});
	taRegisterTool('bold', {
		iconclass: 'fa fa-bold',
		tooltiptext: taTranslations.bold.tooltip,
		action: function(){
			return this.$editor().wrapSelection("bold", null);
		},
		activeState: function(){
			return this.$editor().queryCommandState('bold');
		},
		commandKeyCode: 98
	});
	taRegisterTool('justifyLeft', {
		iconclass: 'fa fa-align-left',
		tooltiptext: taTranslations.justifyLeft.tooltip,
		action: function(){
			return this.$editor().wrapSelection("justifyLeft", null);
		},
		activeState: function(commonElement){
			var result = false;
			if(commonElement) result = commonElement.css('text-align') === 'left' || commonElement.attr('align') === 'left' ||
				(commonElement.css('text-align') !== 'right' && commonElement.css('text-align') !== 'center' && !this.$editor().queryCommandState('justifyRight') && !this.$editor().queryCommandState('justifyCenter'));
			result = result || this.$editor().queryCommandState('justifyLeft');
			return result;
		}
	});
	taRegisterTool('justifyRight', {
		iconclass: 'fa fa-align-right',
		tooltiptext: taTranslations.justifyRight.tooltip,
		action: function(){
			return this.$editor().wrapSelection("justifyRight", null);
		},
		activeState: function(commonElement){
			var result = false;
			if(commonElement) result = commonElement.css('text-align') === 'right';
			result = result || this.$editor().queryCommandState('justifyRight');
			return result;
		}
	});
	taRegisterTool('justifyCenter', {
		iconclass: 'fa fa-align-center',
		tooltiptext: taTranslations.justifyCenter.tooltip,
		action: function(){
			return this.$editor().wrapSelection("justifyCenter", null);
		},
		activeState: function(commonElement){
			var result = false;
			if(commonElement) result = commonElement.css('text-align') === 'center';
			result = result || this.$editor().queryCommandState('justifyCenter');
			return result;
		}
	});
	taRegisterTool('indent', {
		iconclass: 'fa fa-indent',
		tooltiptext: taTranslations.indent.tooltip,
		action: function(){
			return this.$editor().wrapSelection("indent", null);
		},
		activeState: function(){
			return this.$editor().queryFormatBlockState('blockquote'); 
		}
	});
	taRegisterTool('outdent', {
		iconclass: 'fa fa-outdent',
		tooltiptext: taTranslations.outdent.tooltip,
		action: function(){
			return this.$editor().wrapSelection("outdent", null);
		},
		activeState: function(){
			return false;
		}
	});
	taRegisterTool('italics', {
		iconclass: 'fa fa-italic',
		tooltiptext: taTranslations.italic.tooltip,
		action: function(){
			return this.$editor().wrapSelection("italic", null);
		},
		activeState: function(){
			return this.$editor().queryCommandState('italic');
		},
		commandKeyCode: 105
	});
	taRegisterTool('underline', {
		iconclass: 'fa fa-underline',
		tooltiptext: taTranslations.underline.tooltip,
		action: function(){
			return this.$editor().wrapSelection("underline", null);
		},
		activeState: function(){
			return this.$editor().queryCommandState('underline');
		},
		commandKeyCode: 117
	});
	taRegisterTool('clear', {
		iconclass: 'fa fa-ban',
		tooltiptext: taTranslations.clear.tooltip,
		action: function(deferred, restoreSelection){
			this.$editor().wrapSelection("removeFormat", null);
			var possibleNodes = angular.element(taSelection.getSelectionElement());
			// remove lists
			var removeListElements = function(list){
				list = angular.element(list);
				var prevElement = list;
				angular.forEach(list.children(), function(liElem){
					var newElem = angular.element('<p></p>');
					newElem.html(angular.element(liElem).html());
					prevElement.after(newElem);
					prevElement = newElem;
				});
				list.remove();
			};
			angular.forEach(possibleNodes.find("ul"), removeListElements);
			angular.forEach(possibleNodes.find("ol"), removeListElements);
			// clear out all class attributes. These do not seem to be cleared via removeFormat
			var $editor = this.$editor();
			var recursiveRemoveClass = function(node){
				node = angular.element(node);
				if(node[0] !== $editor.displayElements.text[0]) node.removeAttr('class');
				angular.forEach(node.children(), recursiveRemoveClass);
			};
			angular.forEach(possibleNodes, recursiveRemoveClass);
			// check if in list. If not in list then use formatBlock option
			if(possibleNodes[0].tagName.toLowerCase() !== 'li' &&
				possibleNodes[0].tagName.toLowerCase() !== 'ol' &&
				possibleNodes[0].tagName.toLowerCase() !== 'ul') this.$editor().wrapSelection("formatBlock", "<p>");
			restoreSelection();
		}
	});
	
	var imgOnSelectAction = function(event, $element, editorScope){
		// setup the editor toolbar
		// Credit to the work at http://hackerwins.github.io/summernote/ for this editbar logic/display
		var finishEdit = function(){
			editorScope.updateTaBindtaTextElement();
			editorScope.hidePopover();
		};
		event.preventDefault();
		editorScope.displayElements.popover.css('width', '375px');
		var container = editorScope.displayElements.popoverContainer;
		container.empty();
		var buttonGroup = angular.element('<div class="btn-group" style="padding-right: 6px;">');
		var fullButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">100% </button>');
		fullButton.on('click', function(event){
			event.preventDefault();
			$element.css({
				'width': '100%',
				'height': ''
			});
			finishEdit();
		});
		var halfButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">50% </button>');
		halfButton.on('click', function(event){
			event.preventDefault();
			$element.css({
				'width': '50%',
				'height': ''
			});
			finishEdit();
		});
		var quartButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">25% </button>');
		quartButton.on('click', function(event){
			event.preventDefault();
			$element.css({
				'width': '25%',
				'height': ''
			});
			finishEdit();
		});
		var resetButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">Reset</button>');
		resetButton.on('click', function(event){
			event.preventDefault();
			$element.css({
				width: '',
				height: ''
			});
			finishEdit();
		});
		buttonGroup.append(fullButton);
		buttonGroup.append(halfButton);
		buttonGroup.append(quartButton);
		buttonGroup.append(resetButton);
		container.append(buttonGroup);
		
		buttonGroup = angular.element('<div class="btn-group" style="padding-right: 6px;">');
		var floatLeft = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-left"></i></button>');
		floatLeft.on('click', function(event){
			event.preventDefault();
			$element.css('float', 'left');
			finishEdit();
		});
		var floatRight = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-right"></i></button>');
		floatRight.on('click', function(event){
			event.preventDefault();
			$element.css('float', 'right');
			finishEdit();
		});
		var floatNone = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-justify"></i></button>');
		floatNone.on('click', function(event){
			event.preventDefault();
			$element.css('float', '');
			finishEdit();
		});
		buttonGroup.append(floatLeft);
		buttonGroup.append(floatNone);
		buttonGroup.append(floatRight);
		container.append(buttonGroup);
		
		buttonGroup = angular.element('<div class="btn-group">');
		var remove = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-trash-o"></i></button>');
		remove.on('click', function(event){
			event.preventDefault();
			$element.remove();
			finishEdit();
		});
		buttonGroup.append(remove);
		container.append(buttonGroup);
		
		editorScope.showPopover($element);
		editorScope.showResizeOverlay($element);
	};
	
	taRegisterTool('insertImage', {
		iconclass: 'fa fa-picture-o',
		tooltiptext: taTranslations.insertImage.tooltip,
		action: function(){
			var imageLink;
			imageLink = $window.prompt(taTranslations.insertImage.dialogPrompt, 'http://');
			if(imageLink && imageLink !== '' && imageLink !== 'http://'){
				return this.$editor().wrapSelection('insertImage', imageLink, true);
			}
		},
		onElementSelect: {
			element: 'img',
			action: imgOnSelectAction
		}
	});
	taRegisterTool('insertVideo', {
		iconclass: 'fa fa-youtube-play',
		tooltiptext: taTranslations.insertVideo.tooltip,
		action: function(){
			var urlPrompt;
			urlPrompt = $window.prompt(taTranslations.insertVideo.dialogPrompt, 'http://');
			if (urlPrompt && urlPrompt !== '' && urlPrompt !== 'http://') {
				// get the video ID
				var ids = urlPrompt.match(/(\?|&)v=[^&]*/);
				/* istanbul ignore else: if it's invalid don't worry - though probably should show some kind of error message */
				if(ids.length > 0){
					// create the embed link
					var urlLink = "http://www.youtube.com/embed/" + ids[0].substring(3);
					// create the HTML
					var embed = '<img class="ta-insert-video" ta-insert-video="' + urlLink + '" contenteditable="false" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/>';
					// insert
					return this.$editor().wrapSelection('insertHTML', embed, true);
				}
			}
		},
		onElementSelect: {
			element: 'img',
			onlyWithAttrs: ['ta-insert-video'],
			action: imgOnSelectAction
		}
	});	
	taRegisterTool('insertLink', {
		tooltiptext: taTranslations.insertLink.tooltip,
		iconclass: 'fa fa-link',
		action: function(){
			var urlLink;
			urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, 'http://');
			if(urlLink && urlLink !== '' && urlLink !== 'http://'){
				return this.$editor().wrapSelection('createLink', urlLink, true);
			}
		},
		activeState: function(commonElement){
			if(commonElement) return commonElement[0].tagName === 'A';
			return false;
		},
		onElementSelect: {
			element: 'a',
			action: function(event, $element, editorScope){
				// setup the editor toolbar
				// Credit to the work at http://hackerwins.github.io/summernote/ for this editbar logic
				event.preventDefault();
				editorScope.displayElements.popover.css('width', '435px');
				var container = editorScope.displayElements.popoverContainer;
				container.empty();
				container.css('line-height', '28px');
				var link = angular.element('<a href="' + $element.attr('href') + '" target="_blank">' + $element.attr('href') + '</a>');
				link.css({
					'display': 'inline-block',
					'max-width': '200px',
					'overflow': 'hidden',
					'text-overflow': 'ellipsis',
					'white-space': 'nowrap',
					'vertical-align': 'middle'
				});
				container.append(link);
				var buttonGroup = angular.element('<div class="btn-group pull-right">');
				var reLinkButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" tabindex="-1" unselectable="on"><i class="fa fa-edit icon-edit"></i></button>');
				reLinkButton.on('click', function(event){
					event.preventDefault();
					var urlLink = $window.prompt(taTranslations.insertLink.dialogPrompt, $element.attr('href'));
					if(urlLink && urlLink !== '' && urlLink !== 'http://'){
						$element.attr('href', urlLink);
						editorScope.updateTaBindtaTextElement();
					}
					editorScope.hidePopover();
				});
				buttonGroup.append(reLinkButton);
				var unLinkButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" tabindex="-1" unselectable="on"><i class="fa fa-unlink icon-unlink"></i></button>');
				// directly before this click event is fired a digest is fired off whereby the reference to $element is orphaned off
				unLinkButton.on('click', function(event){
					event.preventDefault();
					$element.replaceWith($element.contents());
					editorScope.updateTaBindtaTextElement();
					editorScope.hidePopover();
				});
				buttonGroup.append(unLinkButton);
				var targetToggle = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" tabindex="-1" unselectable="on">Open in New Window</button>');
				if($element.attr('target') === '_blank'){
					targetToggle.addClass('active');
				}
				targetToggle.on('click', function(event){
					event.preventDefault();
					$element.attr('target', ($element.attr('target') === '_blank') ? '' : '_blank');
					targetToggle.toggleClass('active');
					editorScope.updateTaBindtaTextElement();
				});
				buttonGroup.append(targetToggle);
				container.append(buttonGroup);
				editorScope.showPopover($element);
			}
		}
	});
}]);
/*!
 * angular-translate - v2.5.2 - 2014-12-10
 * http://github.com/angular-translate/angular-translate
 * Copyright (c) 2014 ; Licensed MIT
 */
/**
 * @ngdoc overview
 * @name pascalprecht.translate
 *
 * @description
 * The main module which holds everything together.
 */
angular.module('pascalprecht.translate', ['ng'])

.run(['$translate', function ($translate) {

  var key = $translate.storageKey(),
      storage = $translate.storage();

  var fallbackFromIncorrectStorageValue = function() {
    var preferred = $translate.preferredLanguage();
    if (angular.isString(preferred)) {
      $translate.use(preferred);
      // $translate.use() will also remember the language.
      // So, we don't need to call storage.put() here.
    } else {
      storage.put(key, $translate.use());
    }
  };

  if (storage) {
    if (!storage.get(key)) {
      fallbackFromIncorrectStorageValue();
    } else {
      $translate.use(storage.get(key))['catch'](fallbackFromIncorrectStorageValue);
    }
  } else if (angular.isString($translate.preferredLanguage())) {
    $translate.use($translate.preferredLanguage());
  }
}]);

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateProvider
 * @description
 *
 * $translateProvider allows developers to register translation-tables, asynchronous loaders
 * and similar to configure translation behavior directly inside of a module.
 *
 */
angular.module('pascalprecht.translate').provider('$translate', ['$STORAGE_KEY', function ($STORAGE_KEY) {

  var $translationTable = {},
      $preferredLanguage,
      $availableLanguageKeys = [],
      $languageKeyAliases,
      $fallbackLanguage,
      $fallbackWasString,
      $uses,
      $nextLang,
      $storageFactory,
      $storageKey = $STORAGE_KEY,
      $storagePrefix,
      $missingTranslationHandlerFactory,
      $interpolationFactory,
      $interpolatorFactories = [],
      $interpolationSanitizationStrategy = false,
      $loaderFactory,
      $cloakClassName = 'translate-cloak',
      $loaderOptions,
      $notFoundIndicatorLeft,
      $notFoundIndicatorRight,
      $postCompilingEnabled = false,
      NESTED_OBJECT_DELIMITER = '.',
      loaderCache;

  var version = '2.5.2';

  // tries to determine the browsers language
  var getFirstBrowserLanguage = function () {
    var nav = window.navigator,
        browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
        i,
        language;

    // support for HTML 5.1 "navigator.languages"
    if (angular.isArray(nav.languages)) {
      for (i = 0; i < nav.languages.length; i++) {
        language = nav.languages[i];
        if (language && language.length) {
          return language;
        }
      }
    }

    // support for other well known properties in browsers
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
      language = nav[browserLanguagePropertyKeys[i]];
      if (language && language.length) {
        return language;
      }
    }

    return null;
  };
  getFirstBrowserLanguage.displayName = 'angular-translate/service: getFirstBrowserLanguage';

  // tries to determine the browsers locale
  var getLocale = function () {
    return (getFirstBrowserLanguage() || '').split('-').join('_');
  };
  getLocale.displayName = 'angular-translate/service: getLocale';

  /**
   * @name indexOf
   * @private
   *
   * @description
   * indexOf polyfill. Kinda sorta.
   *
   * @param {array} array Array to search in.
   * @param {string} searchElement Element to search for.
   *
   * @returns {int} Index of search element.
   */
  var indexOf = function(array, searchElement) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };

  /**
   * @name trim
   * @private
   *
   * @description
   * trim polyfill
   *
   * @returns {string} The string stripped of whitespace from both ends
   */
  var trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };

  var negotiateLocale = function (preferred) {

    var avail = [],
        locale = angular.lowercase(preferred),
        i = 0,
        n = $availableLanguageKeys.length;

    for (; i < n; i++) {
      avail.push(angular.lowercase($availableLanguageKeys[i]));
    }

    if (indexOf(avail, locale) > -1) {
      return preferred;
    }

    if ($languageKeyAliases) {
      var alias;
      for (var langKeyAlias in $languageKeyAliases) {
        var hasWildcardKey = false;
        var hasExactKey = Object.prototype.hasOwnProperty.call($languageKeyAliases, langKeyAlias) &&
          angular.lowercase(langKeyAlias) === angular.lowercase(preferred);

        if (langKeyAlias.slice(-1) === '*') {
          hasWildcardKey = langKeyAlias.slice(0, -1) === preferred.slice(0, langKeyAlias.length-1);
        }
        if (hasExactKey || hasWildcardKey) {
          alias = $languageKeyAliases[langKeyAlias];
          if (indexOf(avail, angular.lowercase(alias)) > -1) {
            return alias;
          }
        }
      }
    }

    var parts = preferred.split('_');

    if (parts.length > 1 && indexOf(avail, angular.lowercase(parts[0])) > -1) {
      return parts[0];
    }

    // If everything fails, just return the preferred, unchanged.
    return preferred;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#translations
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Registers a new translation table for specific language key.
   *
   * To register a translation table for specific language, pass a defined language
   * key as first parameter.
   *
   * <pre>
   *  // register translation table for language: 'de_DE'
   *  $translateProvider.translations('de_DE', {
   *    'GREETING': 'Hallo Welt!'
   *  });
   *
   *  // register another one
   *  $translateProvider.translations('en_US', {
   *    'GREETING': 'Hello world!'
   *  });
   * </pre>
   *
   * When registering multiple translation tables for for the same language key,
   * the actual translation table gets extended. This allows you to define module
   * specific translation which only get added, once a specific module is loaded in
   * your app.
   *
   * Invoking this method with no arguments returns the translation table which was
   * registered with no language key. Invoking it with a language key returns the
   * related translation table.
   *
   * @param {string} key A language key.
   * @param {object} translationTable A plain old JavaScript object that represents a translation table.
   *
   */
  var translations = function (langKey, translationTable) {

    if (!langKey && !translationTable) {
      return $translationTable;
    }

    if (langKey && !translationTable) {
      if (angular.isString(langKey)) {
        return $translationTable[langKey];
      }
    } else {
      if (!angular.isObject($translationTable[langKey])) {
        $translationTable[langKey] = {};
      }
      angular.extend($translationTable[langKey], flatObject(translationTable));
    }
    return this;
  };

  this.translations = translations;

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#cloakClassName
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   *
   * Let's you change the class name for `translate-cloak` directive.
   * Default class name is `translate-cloak`.
   *
   * @param {string} name translate-cloak class name
   */
  this.cloakClassName = function (name) {
    if (!name) {
      return $cloakClassName;
    }
    $cloakClassName = name;
    return this;
  };

  /**
   * @name flatObject
   * @private
   *
   * @description
   * Flats an object. This function is used to flatten given translation data with
   * namespaces, so they are later accessible via dot notation.
   */
  var flatObject = function (data, path, result, prevKey) {
    var key, keyWithPath, keyWithShortPath, val;

    if (!path) {
      path = [];
    }
    if (!result) {
      result = {};
    }
    for (key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        continue;
      }
      val = data[key];
      if (angular.isObject(val)) {
        flatObject(val, path.concat(key), result, key);
      } else {
        keyWithPath = path.length ? ('' + path.join(NESTED_OBJECT_DELIMITER) + NESTED_OBJECT_DELIMITER + key) : key;
        if(path.length && key === prevKey){
          // Create shortcut path (foo.bar == foo.bar.bar)
          keyWithShortPath = '' + path.join(NESTED_OBJECT_DELIMITER);
          // Link it to original path
          result[keyWithShortPath] = '@:' + keyWithPath;
        }
        result[keyWithPath] = val;
      }
    }
    return result;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#addInterpolation
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Adds interpolation services to angular-translate, so it can manage them.
   *
   * @param {object} factory Interpolation service factory
   */
  this.addInterpolation = function (factory) {
    $interpolatorFactories.push(factory);
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useMessageFormatInterpolation
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use interpolation functionality of messageformat.js.
   * This is useful when having high level pluralization and gender selection.
   */
  this.useMessageFormatInterpolation = function () {
    return this.useInterpolation('$translateMessageFormatInterpolation');
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useInterpolation
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate which interpolation style to use as default, application-wide.
   * Simply pass a factory/service name. The interpolation service has to implement
   * the correct interface.
   *
   * @param {string} factory Interpolation service name.
   */
  this.useInterpolation = function (factory) {
    $interpolationFactory = factory;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useSanitizeStrategy
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Simply sets a sanitation strategy type.
   *
   * @param {string} value Strategy type.
   */
  this.useSanitizeValueStrategy = function (value) {
    $interpolationSanitizationStrategy = value;
    return this;
  };

 /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#preferredLanguage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells the module which of the registered translation tables to use for translation
   * at initial startup by passing a language key. Similar to `$translateProvider#use`
   * only that it says which language to **prefer**.
   *
   * @param {string} langKey A language key.
   *
   */
  this.preferredLanguage = function(langKey) {
    setupPreferredLanguage(langKey);
    return this;

  };
  var setupPreferredLanguage = function (langKey) {
    if (langKey) {
      $preferredLanguage = langKey;
    }
    return $preferredLanguage;
  };
  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicator
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Sets an indicator which is used when a translation isn't found. E.g. when
   * setting the indicator as 'X' and one tries to translate a translation id
   * called `NOT_FOUND`, this will result in `X NOT_FOUND X`.
   *
   * Internally this methods sets a left indicator and a right indicator using
   * `$translateProvider.translationNotFoundIndicatorLeft()` and
   * `$translateProvider.translationNotFoundIndicatorRight()`.
   *
   * **Note**: These methods automatically add a whitespace between the indicators
   * and the translation id.
   *
   * @param {string} indicator An indicator, could be any string.
   */
  this.translationNotFoundIndicator = function (indicator) {
    this.translationNotFoundIndicatorLeft(indicator);
    this.translationNotFoundIndicatorRight(indicator);
    return this;
  };

  /**
   * ngdoc function
   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicatorLeft
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Sets an indicator which is used when a translation isn't found left to the
   * translation id.
   *
   * @param {string} indicator An indicator.
   */
  this.translationNotFoundIndicatorLeft = function (indicator) {
    if (!indicator) {
      return $notFoundIndicatorLeft;
    }
    $notFoundIndicatorLeft = indicator;
    return this;
  };

  /**
   * ngdoc function
   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicatorLeft
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Sets an indicator which is used when a translation isn't found right to the
   * translation id.
   *
   * @param {string} indicator An indicator.
   */
  this.translationNotFoundIndicatorRight = function (indicator) {
    if (!indicator) {
      return $notFoundIndicatorRight;
    }
    $notFoundIndicatorRight = indicator;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#fallbackLanguage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells the module which of the registered translation tables to use when missing translations
   * at initial startup by passing a language key. Similar to `$translateProvider#use`
   * only that it says which language to **fallback**.
   *
   * @param {string||array} langKey A language key.
   *
   */
  this.fallbackLanguage = function (langKey) {
    fallbackStack(langKey);
    return this;
  };

  var fallbackStack = function (langKey) {
    if (langKey) {
      if (angular.isString(langKey)) {
        $fallbackWasString = true;
        $fallbackLanguage = [ langKey ];
      } else if (angular.isArray(langKey)) {
        $fallbackWasString = false;
        $fallbackLanguage = langKey;
      }
      if (angular.isString($preferredLanguage)  && indexOf($fallbackLanguage, $preferredLanguage) < 0) {
        $fallbackLanguage.push($preferredLanguage);
      }

      return this;
    } else {
      if ($fallbackWasString) {
        return $fallbackLanguage[0];
      } else {
        return $fallbackLanguage;
      }
    }
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#use
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Set which translation table to use for translation by given language key. When
   * trying to 'use' a language which isn't provided, it'll throw an error.
   *
   * You actually don't have to use this method since `$translateProvider#preferredLanguage`
   * does the job too.
   *
   * @param {string} langKey A language key.
   */
  this.use = function (langKey) {
    if (langKey) {
      if (!$translationTable[langKey] && (!$loaderFactory)) {
        // only throw an error, when not loading translation data asynchronously
        throw new Error("$translateProvider couldn't find translationTable for langKey: '" + langKey + "'");
      }
      $uses = langKey;
      return this;
    }
    return $uses;
  };

 /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#storageKey
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells the module which key must represent the choosed language by a user in the storage.
   *
   * @param {string} key A key for the storage.
   */
  var storageKey = function(key) {
    if (!key) {
      if ($storagePrefix) {
        return $storagePrefix + $storageKey;
      }
      return $storageKey;
    }
    $storageKey = key;
  };

  this.storageKey = storageKey;

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useUrlLoader
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateUrlLoader` extension service as loader.
   *
   * @param {string} url Url
   * @param {Object=} options Optional configuration object
   */
  this.useUrlLoader = function (url, options) {
    return this.useLoader('$translateUrlLoader', angular.extend({ url: url }, options));
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useStaticFilesLoader
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateStaticFilesLoader` extension service as loader.
   *
   * @param {Object=} options Optional configuration object
   */
  this.useStaticFilesLoader = function (options) {
    return this.useLoader('$translateStaticFilesLoader', options);
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useLoader
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use any other service as loader.
   *
   * @param {string} loaderFactory Factory name to use
   * @param {Object=} options Optional configuration object
   */
  this.useLoader = function (loaderFactory, options) {
    $loaderFactory = loaderFactory;
    $loaderOptions = options || {};
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useLocalStorage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateLocalStorage` service as storage layer.
   *
   */
  this.useLocalStorage = function () {
    return this.useStorage('$translateLocalStorage');
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useCookieStorage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use `$translateCookieStorage` service as storage layer.
   */
  this.useCookieStorage = function () {
    return this.useStorage('$translateCookieStorage');
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useStorage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use custom service as storage layer.
   */
  this.useStorage = function (storageFactory) {
    $storageFactory = storageFactory;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#storagePrefix
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Sets prefix for storage key.
   *
   * @param {string} prefix Storage key prefix
   */
  this.storagePrefix = function (prefix) {
    if (!prefix) {
      return prefix;
    }
    $storagePrefix = prefix;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useMissingTranslationHandlerLog
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to use built-in log handler when trying to translate
   * a translation Id which doesn't exist.
   *
   * This is actually a shortcut method for `useMissingTranslationHandler()`.
   *
   */
  this.useMissingTranslationHandlerLog = function () {
    return this.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useMissingTranslationHandler
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Expects a factory name which later gets instantiated with `$injector`.
   * This method can be used to tell angular-translate to use a custom
   * missingTranslationHandler. Just build a factory which returns a function
   * and expects a translation id as argument.
   *
   * Example:
   * <pre>
   *  app.config(function ($translateProvider) {
   *    $translateProvider.useMissingTranslationHandler('customHandler');
   *  });
   *
   *  app.factory('customHandler', function (dep1, dep2) {
   *    return function (translationId) {
   *      // something with translationId and dep1 and dep2
   *    };
   *  });
   * </pre>
   *
   * @param {string} factory Factory name
   */
  this.useMissingTranslationHandler = function (factory) {
    $missingTranslationHandlerFactory = factory;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#usePostCompiling
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * If post compiling is enabled, all translated values will be processed
   * again with AngularJS' $compile.
   *
   * Example:
   * <pre>
   *  app.config(function ($translateProvider) {
   *    $translateProvider.usePostCompiling(true);
   *  });
   * </pre>
   *
   * @param {string} factory Factory name
   */
  this.usePostCompiling = function (value) {
    $postCompilingEnabled = !(!value);
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#determinePreferredLanguage
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Tells angular-translate to try to determine on its own which language key
   * to set as preferred language. When `fn` is given, angular-translate uses it
   * to determine a language key, otherwise it uses the built-in `getLocale()`
   * method.
   *
   * The `getLocale()` returns a language key in the format `[lang]_[country]` or
   * `[lang]` depending on what the browser provides.
   *
   * Use this method at your own risk, since not all browsers return a valid
   * locale.
   *
   * @param {object=} fn Function to determine a browser's locale
   */
  this.determinePreferredLanguage = function (fn) {

    var locale = (fn && angular.isFunction(fn)) ? fn() : getLocale();

    if (!$availableLanguageKeys.length) {
      $preferredLanguage = locale;
    } else {
      $preferredLanguage = negotiateLocale(locale);
    }

    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#registerAvailableLanguageKeys
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Registers a set of language keys the app will work with. Use this method in
   * combination with
   * {@link pascalprecht.translate.$translateProvider#determinePreferredLanguage determinePreferredLanguage}.
   * When available languages keys are registered, angular-translate
   * tries to find the best fitting language key depending on the browsers locale,
   * considering your language key convention.
   *
   * @param {object} languageKeys Array of language keys the your app will use
   * @param {object=} aliases Alias map.
   */
  this.registerAvailableLanguageKeys = function (languageKeys, aliases) {
    if (languageKeys) {
      $availableLanguageKeys = languageKeys;
      if (aliases) {
        $languageKeyAliases = aliases;
      }
      return this;
    }
    return $availableLanguageKeys;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateProvider#useLoaderCache
   * @methodOf pascalprecht.translate.$translateProvider
   *
   * @description
   * Registers a cache for internal $http based loaders.
   * {@link pascalprecht.translate.$translateProvider#determinePreferredLanguage determinePreferredLanguage}.
   * When false the cache will be disabled (default). When true or undefined
   * the cache will be a default (see $cacheFactory). When an object it will
   * be treat as a cache object itself: the usage is $http({cache: cache})
   *
   * @param {object} cache boolean, string or cache-object
   */
  this.useLoaderCache = function (cache) {
    if (cache === false) {
      // disable cache
      loaderCache = undefined;
    } else if (cache === true) {
      // enable cache using AJS defaults
      loaderCache = true;
    } else if (typeof(cache) === 'undefined') {
      // enable cache using default
      loaderCache = '$translationCache';
    } else if (cache) {
      // enable cache using given one (see $cacheFactory)
      loaderCache = cache;
    }
    return this;
  };

  /**
   * @ngdoc object
   * @name pascalprecht.translate.$translate
   * @requires $interpolate
   * @requires $log
   * @requires $rootScope
   * @requires $q
   *
   * @description
   * The `$translate` service is the actual core of angular-translate. It expects a translation id
   * and optional interpolate parameters to translate contents.
   *
   * <pre>
   *  $translate('HEADLINE_TEXT').then(function (translation) {
   *    $scope.translatedText = translation;
   *  });
   * </pre>
   *
   * @param {string|array} translationId A token which represents a translation id
   *                                     This can be optionally an array of translation ids which
   *                                     results that the function returns an object where each key
   *                                     is the translation id and the value the translation.
   * @param {object=} interpolateParams An object hash for dynamic values
   * @param {string} interpolationId The id of the interpolation to use
   * @returns {object} promise
   */
  this.$get = [
    '$log',
    '$injector',
    '$rootScope',
    '$q',
    function ($log, $injector, $rootScope, $q) {

      var Storage,
          defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'),
          pendingLoader = false,
          interpolatorHashMap = {},
          langPromises = {},
          fallbackIndex,
          startFallbackIteration;

      var $translate = function (translationId, interpolateParams, interpolationId) {

        // Duck detection: If the first argument is an array, a bunch of translations was requested.
        // The result is an object.
        if (angular.isArray(translationId)) {
          // Inspired by Q.allSettled by Kris Kowal
          // https://github.com/kriskowal/q/blob/b0fa72980717dc202ffc3cbf03b936e10ebbb9d7/q.js#L1553-1563
          // This transforms all promises regardless resolved or rejected
          var translateAll = function (translationIds) {
            var results = {}; // storing the actual results
            var promises = []; // promises to wait for
            // Wraps the promise a) being always resolved and b) storing the link id->value
            var translate = function (translationId) {
              var deferred = $q.defer();
              var regardless = function (value) {
                results[translationId] = value;
                deferred.resolve([translationId, value]);
              };
              // we don't care whether the promise was resolved or rejected; just store the values
              $translate(translationId, interpolateParams, interpolationId).then(regardless, regardless);
              return deferred.promise;
            };
            for (var i = 0, c = translationIds.length; i < c; i++) {
              promises.push(translate(translationIds[i]));
            }
            // wait for all (including storing to results)
            return $q.all(promises).then(function () {
              // return the results
              return results;
            });
          };
          return translateAll(translationId);
        }

        var deferred = $q.defer();

        // trim off any whitespace
        if (translationId) {
          translationId = trim.apply(translationId);
        }

        var promiseToWaitFor = (function () {
          var promise = $preferredLanguage ?
            langPromises[$preferredLanguage] :
            langPromises[$uses];

          fallbackIndex = 0;

          if ($storageFactory && !promise) {
            // looks like there's no pending promise for $preferredLanguage or
            // $uses. Maybe there's one pending for a language that comes from
            // storage.
            var langKey = Storage.get($storageKey);
            promise = langPromises[langKey];

            if ($fallbackLanguage && $fallbackLanguage.length) {
                var index = indexOf($fallbackLanguage, langKey);
                // maybe the language from storage is also defined as fallback language
                // we increase the fallback language index to not search in that language
                // as fallback, since it's probably the first used language
                // in that case the index starts after the first element
                fallbackIndex = (index === 0) ? 1 : 0;

                // but we can make sure to ALWAYS fallback to preferred language at least
                if (indexOf($fallbackLanguage, $preferredLanguage) < 0) {
                  $fallbackLanguage.push($preferredLanguage);
                }
            }
          }
          return promise;
        }());

        if (!promiseToWaitFor) {
          // no promise to wait for? okay. Then there's no loader registered
          // nor is a one pending for language that comes from storage.
          // We can just translate.
          determineTranslation(translationId, interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
        } else {
          promiseToWaitFor.then(function () {
            determineTranslation(translationId, interpolateParams, interpolationId).then(deferred.resolve, deferred.reject);
          }, deferred.reject);
        }
        return deferred.promise;
      };

      /**
       * @name applyNotFoundIndicators
       * @private
       *
       * @description
       * Applies not fount indicators to given translation id, if needed.
       * This function gets only executed, if a translation id doesn't exist,
       * which is why a translation id is expected as argument.
       *
       * @param {string} translationId Translation id.
       * @returns {string} Same as given translation id but applied with not found
       * indicators.
       */
      var applyNotFoundIndicators = function (translationId) {
        // applying notFoundIndicators
        if ($notFoundIndicatorLeft) {
          translationId = [$notFoundIndicatorLeft, translationId].join(' ');
        }
        if ($notFoundIndicatorRight) {
          translationId = [translationId, $notFoundIndicatorRight].join(' ');
        }
        return translationId;
      };

      /**
       * @name useLanguage
       * @private
       *
       * @description
       * Makes actual use of a language by setting a given language key as used
       * language and informs registered interpolators to also use the given
       * key as locale.
       *
       * @param {key} Locale key.
       */
      var useLanguage = function (key) {
        $uses = key;
        $rootScope.$emit('$translateChangeSuccess', {language: key});

        if ($storageFactory) {
          Storage.put($translate.storageKey(), $uses);
        }
        // inform default interpolator
        defaultInterpolator.setLocale($uses);
        // inform all others too!
        angular.forEach(interpolatorHashMap, function (interpolator, id) {
          interpolatorHashMap[id].setLocale($uses);
        });
        $rootScope.$emit('$translateChangeEnd', {language: key});
      };

      /**
       * @name loadAsync
       * @private
       *
       * @description
       * Kicks of registered async loader using `$injector` and applies existing
       * loader options. When resolved, it updates translation tables accordingly
       * or rejects with given language key.
       *
       * @param {string} key Language key.
       * @return {Promise} A promise.
       */
      var loadAsync = function (key) {
        if (!key) {
          throw 'No language key specified for loading.';
        }

        var deferred = $q.defer();

        $rootScope.$emit('$translateLoadingStart', {language: key});
        pendingLoader = true;

        var cache = loaderCache;
        if (typeof(cache) === 'string') {
          // getting on-demand instance of loader
          cache = $injector.get(cache);
        }

        var loaderOptions = angular.extend({}, $loaderOptions, {
          key: key,
          $http: angular.extend({}, {
            cache: cache
          }, $loaderOptions.$http)
        });

        $injector.get($loaderFactory)(loaderOptions).then(function (data) {
          var translationTable = {};
          $rootScope.$emit('$translateLoadingSuccess', {language: key});

          if (angular.isArray(data)) {
            angular.forEach(data, function (table) {
              angular.extend(translationTable, flatObject(table));
            });
          } else {
            angular.extend(translationTable, flatObject(data));
          }
          pendingLoader = false;
          deferred.resolve({
            key: key,
            table: translationTable
          });
          $rootScope.$emit('$translateLoadingEnd', {language: key});
        }, function (key) {
          $rootScope.$emit('$translateLoadingError', {language: key});
          deferred.reject(key);
          $rootScope.$emit('$translateLoadingEnd', {language: key});
        });
        return deferred.promise;
      };

      if ($storageFactory) {
        Storage = $injector.get($storageFactory);

        if (!Storage.get || !Storage.put) {
          throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or put() method!');
        }
      }

      // apply additional settings
      if (angular.isFunction(defaultInterpolator.useSanitizeValueStrategy)) {
        defaultInterpolator.useSanitizeValueStrategy($interpolationSanitizationStrategy);
      }

      // if we have additional interpolations that were added via
      // $translateProvider.addInterpolation(), we have to map'em
      if ($interpolatorFactories.length) {
        angular.forEach($interpolatorFactories, function (interpolatorFactory) {
          var interpolator = $injector.get(interpolatorFactory);
          // setting initial locale for each interpolation service
          interpolator.setLocale($preferredLanguage || $uses);
          // apply additional settings
          if (angular.isFunction(interpolator.useSanitizeValueStrategy)) {
            interpolator.useSanitizeValueStrategy($interpolationSanitizationStrategy);
          }
          // make'em recognizable through id
          interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
        });
      }

      /**
       * @name getTranslationTable
       * @private
       *
       * @description
       * Returns a promise that resolves to the translation table
       * or is rejected if an error occurred.
       *
       * @param langKey
       * @returns {Q.promise}
       */
      var getTranslationTable = function (langKey) {
        var deferred = $q.defer();
        if (Object.prototype.hasOwnProperty.call($translationTable, langKey)) {
          deferred.resolve($translationTable[langKey]);
        } else if (langPromises[langKey]) {
          langPromises[langKey].then(function (data) {
            translations(data.key, data.table);
            deferred.resolve(data.table);
          }, deferred.reject);
        } else {
          deferred.reject();
        }
        return deferred.promise;
      };

      /**
       * @name getFallbackTranslation
       * @private
       *
       * @description
       * Returns a promise that will resolve to the translation
       * or be rejected if no translation was found for the language.
       * This function is currently only used for fallback language translation.
       *
       * @param langKey The language to translate to.
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {Q.promise}
       */
      var getFallbackTranslation = function (langKey, translationId, interpolateParams, Interpolator) {
        var deferred = $q.defer();

        getTranslationTable(langKey).then(function (translationTable) {
          if (Object.prototype.hasOwnProperty.call(translationTable, translationId)) {
            Interpolator.setLocale(langKey);
            deferred.resolve(Interpolator.interpolate(translationTable[translationId], interpolateParams));
            Interpolator.setLocale($uses);
          } else {
            deferred.reject();
          }
        }, deferred.reject);

        return deferred.promise;
      };

      /**
       * @name getFallbackTranslationInstant
       * @private
       *
       * @description
       * Returns a translation
       * This function is currently only used for fallback language translation.
       *
       * @param langKey The language to translate to.
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {string} translation
       */
      var getFallbackTranslationInstant = function (langKey, translationId, interpolateParams, Interpolator) {
        var result, translationTable = $translationTable[langKey];

        if (translationTable && Object.prototype.hasOwnProperty.call(translationTable, translationId)) {
          Interpolator.setLocale(langKey);
          result = Interpolator.interpolate(translationTable[translationId], interpolateParams);
          Interpolator.setLocale($uses);
        }

        return result;
      };


      /**
       * @name translateByHandler
       * @private
       *
       * Translate by missing translation handler.
       *
       * @param translationId
       * @returns translation created by $missingTranslationHandler or translationId is $missingTranslationHandler is
       * absent
       */
      var translateByHandler = function (translationId) {
        // If we have a handler factory - we might also call it here to determine if it provides
        // a default text for a translationid that can't be found anywhere in our tables
        if ($missingTranslationHandlerFactory) {
          var resultString = $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
          if (resultString !== undefined) {
            return resultString;
          } else {
            return translationId;
          }
        } else {
          return translationId;
        }
      };

      /**
       * @name resolveForFallbackLanguage
       * @private
       *
       * Recursive helper function for fallbackTranslation that will sequentially look
       * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
       *
       * @param fallbackLanguageIndex
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {Q.promise} Promise that will resolve to the translation.
       */
      var resolveForFallbackLanguage = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
        var deferred = $q.defer();

        if (fallbackLanguageIndex < $fallbackLanguage.length) {
          var langKey = $fallbackLanguage[fallbackLanguageIndex];
          getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator).then(
            deferred.resolve,
            function () {
              // Look in the next fallback language for a translation.
              // It delays the resolving by passing another promise to resolve.
              resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator).then(deferred.resolve);
            }
          );
        } else {
          // No translation found in any fallback language
          deferred.resolve(translateByHandler(translationId));
        }
        return deferred.promise;
      };

      /**
       * @name resolveForFallbackLanguageInstant
       * @private
       *
       * Recursive helper function for fallbackTranslation that will sequentially look
       * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
       *
       * @param fallbackLanguageIndex
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {string} translation
       */
      var resolveForFallbackLanguageInstant = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
        var result;

        if (fallbackLanguageIndex < $fallbackLanguage.length) {
          var langKey = $fallbackLanguage[fallbackLanguageIndex];
          result = getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator);
          if (!result) {
            result = resolveForFallbackLanguageInstant(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
          }
        }
        return result;
      };

      /**
       * Translates with the usage of the fallback languages.
       *
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {Q.promise} Promise, that resolves to the translation.
       */
      var fallbackTranslation = function (translationId, interpolateParams, Interpolator) {
        // Start with the fallbackLanguage with index 0
        return resolveForFallbackLanguage((startFallbackIteration>0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator);
      };

      /**
       * Translates with the usage of the fallback languages.
       *
       * @param translationId
       * @param interpolateParams
       * @param Interpolator
       * @returns {String} translation
       */
      var fallbackTranslationInstant = function (translationId, interpolateParams, Interpolator) {
        // Start with the fallbackLanguage with index 0
        return resolveForFallbackLanguageInstant((startFallbackIteration>0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator);
      };

      var determineTranslation = function (translationId, interpolateParams, interpolationId) {

        var deferred = $q.defer();

        var table = $uses ? $translationTable[$uses] : $translationTable,
            Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;

        // if the translation id exists, we can just interpolate it
        if (table && Object.prototype.hasOwnProperty.call(table, translationId)) {
          var translation = table[translationId];

          // If using link, rerun $translate with linked translationId and return it
          if (translation.substr(0, 2) === '@:') {

            $translate(translation.substr(2), interpolateParams, interpolationId)
              .then(deferred.resolve, deferred.reject);
          } else {
            deferred.resolve(Interpolator.interpolate(translation, interpolateParams));
          }
        } else {
          var missingTranslationHandlerTranslation;
          // for logging purposes only (as in $translateMissingTranslationHandlerLog), value is not returned to promise
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            missingTranslationHandlerTranslation = translateByHandler(translationId);
          }

          // since we couldn't translate the inital requested translation id,
          // we try it now with one or more fallback languages, if fallback language(s) is
          // configured.
          if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
            fallbackTranslation(translationId, interpolateParams, Interpolator)
                .then(function (translation) {
                  deferred.resolve(translation);
                }, function (_translationId) {
                  deferred.reject(applyNotFoundIndicators(_translationId));
                });
          } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
            // looks like the requested translation id doesn't exists.
            // Now, if there is a registered handler for missing translations and no
            // asyncLoader is pending, we execute the handler
            deferred.resolve(missingTranslationHandlerTranslation);
          } else {
            deferred.reject(applyNotFoundIndicators(translationId));
          }
        }
        return deferred.promise;
      };

      var determineTranslationInstant = function (translationId, interpolateParams, interpolationId) {

        var result, table = $uses ? $translationTable[$uses] : $translationTable,
            Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;

        // if the translation id exists, we can just interpolate it
        if (table && Object.prototype.hasOwnProperty.call(table, translationId)) {
          var translation = table[translationId];

          // If using link, rerun $translate with linked translationId and return it
          if (translation.substr(0, 2) === '@:') {
            result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId);
          } else {
            result = Interpolator.interpolate(translation, interpolateParams);
          }
        } else {
          var missingTranslationHandlerTranslation;
          // for logging purposes only (as in $translateMissingTranslationHandlerLog), value is not returned to promise
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            missingTranslationHandlerTranslation = translateByHandler(translationId);
          }

          // since we couldn't translate the inital requested translation id,
          // we try it now with one or more fallback languages, if fallback language(s) is
          // configured.
          if ($uses && $fallbackLanguage && $fallbackLanguage.length) {
            fallbackIndex = 0;
            result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator);
          } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
            // looks like the requested translation id doesn't exists.
            // Now, if there is a registered handler for missing translations and no
            // asyncLoader is pending, we execute the handler
            result = missingTranslationHandlerTranslation;
          } else {
            result = applyNotFoundIndicators(translationId);
          }
        }

        return result;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#preferredLanguage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the language key for the preferred language.
       *
       * @param {string} langKey language String or Array to be used as preferredLanguage (changing at runtime)
       *
       * @return {string} preferred language key
       */
      $translate.preferredLanguage = function (langKey) {
        if(langKey) {
          setupPreferredLanguage(langKey);
        }
        return $preferredLanguage;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#cloakClassName
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the configured class name for `translate-cloak` directive.
       *
       * @return {string} cloakClassName
       */
      $translate.cloakClassName = function () {
        return $cloakClassName;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#fallbackLanguage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the language key for the fallback languages or sets a new fallback stack.
       *
       * @param {string=} langKey language String or Array of fallback languages to be used (to change stack at runtime)
       *
       * @return {string||array} fallback language key
       */
      $translate.fallbackLanguage = function (langKey) {
        if (langKey !== undefined && langKey !== null) {
          fallbackStack(langKey);

          // as we might have an async loader initiated and a new translation language might have been defined
          // we need to add the promise to the stack also. So - iterate.
          if ($loaderFactory) {
            if ($fallbackLanguage && $fallbackLanguage.length) {
              for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
                if (!langPromises[$fallbackLanguage[i]]) {
                  langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
                }
              }
            }
          }
          $translate.use($translate.use());
        }
        if ($fallbackWasString) {
          return $fallbackLanguage[0];
        } else {
          return $fallbackLanguage;
        }

      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#useFallbackLanguage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Sets the first key of the fallback language stack to be used for translation.
       * Therefore all languages in the fallback array BEFORE this key will be skipped!
       *
       * @param {string=} langKey Contains the langKey the iteration shall start with. Set to false if you want to
       * get back to the whole stack
       */
      $translate.useFallbackLanguage = function (langKey) {
        if (langKey !== undefined && langKey !== null) {
          if (!langKey) {
            startFallbackIteration = 0;
          } else {
            var langKeyPosition = indexOf($fallbackLanguage, langKey);
            if (langKeyPosition > -1) {
              startFallbackIteration = langKeyPosition;
            }
          }

        }

      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#proposedLanguage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the language key of language that is currently loaded asynchronously.
       *
       * @return {string} language key
       */
      $translate.proposedLanguage = function () {
        return $nextLang;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#storage
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns registered storage.
       *
       * @return {object} Storage
       */
      $translate.storage = function () {
        return Storage;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#use
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Tells angular-translate which language to use by given language key. This method is
       * used to change language at runtime. It also takes care of storing the language
       * key in a configured store to let your app remember the choosed language.
       *
       * When trying to 'use' a language which isn't available it tries to load it
       * asynchronously with registered loaders.
       *
       * Returns promise object with loaded language file data
       * @example
       * $translate.use("en_US").then(function(data){
       *   $scope.text = $translate("HELLO");
       * });
       *
       * @param {string} key Language key
       * @return {string} Language key
       */
      $translate.use = function (key) {
        if (!key) {
          return $uses;
        }

        var deferred = $q.defer();

        $rootScope.$emit('$translateChangeStart', {language: key});

        // Try to get the aliased language key
        var aliasedKey = negotiateLocale(key);
        if (aliasedKey) {
          key = aliasedKey;
        }

        // if there isn't a translation table for the language we've requested,
        // we load it asynchronously
        if (!$translationTable[key] && $loaderFactory && !langPromises[key]) {
          $nextLang = key;
          langPromises[key] = loadAsync(key).then(function (translation) {
            translations(translation.key, translation.table);
            deferred.resolve(translation.key);

            useLanguage(translation.key);
            if ($nextLang === key) {
              $nextLang = undefined;
            }
            return translation;
          }, function (key) {
            if ($nextLang === key) {
              $nextLang = undefined;
            }
            $rootScope.$emit('$translateChangeError', {language: key});
            deferred.reject(key);
            $rootScope.$emit('$translateChangeEnd', {language: key});
          });
        } else {
          deferred.resolve(key);
          useLanguage(key);
        }

        return deferred.promise;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#storageKey
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the key for the storage.
       *
       * @return {string} storage key
       */
      $translate.storageKey = function () {
        return storageKey();
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#isPostCompilingEnabled
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns whether post compiling is enabled or not
       *
       * @return {bool} storage key
       */
      $translate.isPostCompilingEnabled = function () {
        return $postCompilingEnabled;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#refresh
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Refreshes a translation table pointed by the given langKey. If langKey is not specified,
       * the module will drop all existent translation tables and load new version of those which
       * are currently in use.
       *
       * Refresh means that the module will drop target translation table and try to load it again.
       *
       * In case there are no loaders registered the refresh() method will throw an Error.
       *
       * If the module is able to refresh translation tables refresh() method will broadcast
       * $translateRefreshStart and $translateRefreshEnd events.
       *
       * @example
       * // this will drop all currently existent translation tables and reload those which are
       * // currently in use
       * $translate.refresh();
       * // this will refresh a translation table for the en_US language
       * $translate.refresh('en_US');
       *
       * @param {string} langKey A language key of the table, which has to be refreshed
       *
       * @return {promise} Promise, which will be resolved in case a translation tables refreshing
       * process is finished successfully, and reject if not.
       */
      $translate.refresh = function (langKey) {
        if (!$loaderFactory) {
          throw new Error('Couldn\'t refresh translation table, no loader registered!');
        }

        var deferred = $q.defer();

        function resolve() {
          deferred.resolve();
          $rootScope.$emit('$translateRefreshEnd', {language: langKey});
        }

        function reject() {
          deferred.reject();
          $rootScope.$emit('$translateRefreshEnd', {language: langKey});
        }

        $rootScope.$emit('$translateRefreshStart', {language: langKey});

        if (!langKey) {
          // if there's no language key specified we refresh ALL THE THINGS!
          var tables = [], loadingKeys = {};

          // reload registered fallback languages
          if ($fallbackLanguage && $fallbackLanguage.length) {
            for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
              tables.push(loadAsync($fallbackLanguage[i]));
              loadingKeys[$fallbackLanguage[i]] = true;
            }
          }

          // reload currently used language
          if ($uses && !loadingKeys[$uses]) {
            tables.push(loadAsync($uses));
          }

          $q.all(tables).then(function (tableData) {
            angular.forEach(tableData, function (data) {
              if ($translationTable[data.key]) {
                delete $translationTable[data.key];
              }
              translations(data.key, data.table);
            });
            if ($uses) {
              useLanguage($uses);
            }
            resolve();
          });

        } else if ($translationTable[langKey]) {

          loadAsync(langKey).then(function (data) {
            translations(data.key, data.table);
            if (langKey === $uses) {
              useLanguage($uses);
            }
            resolve();
          }, reject);

        } else {
          reject();
        }
        return deferred.promise;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#instant
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns a translation instantly from the internal state of loaded translation. All rules
       * regarding the current language, the preferred language of even fallback languages will be
       * used except any promise handling. If a language was not found, an asynchronous loading
       * will be invoked in the background.
       *
       * @param {string|array} translationId A token which represents a translation id
       *                                     This can be optionally an array of translation ids which
       *                                     results that the function's promise returns an object where
       *                                     each key is the translation id and the value the translation.
       * @param {object} interpolateParams Params
       * @param {string} interpolationId The id of the interpolation to use
       *
       * @return {string} translation
       */
      $translate.instant = function (translationId, interpolateParams, interpolationId) {

        // Detect undefined and null values to shorten the execution and prevent exceptions
        if (translationId === null || angular.isUndefined(translationId)) {
          return translationId;
        }

        // Duck detection: If the first argument is an array, a bunch of translations was requested.
        // The result is an object.
        if (angular.isArray(translationId)) {
          var results = {};
          for (var i = 0, c = translationId.length; i < c; i++) {
            results[translationId[i]] = $translate.instant(translationId[i], interpolateParams, interpolationId);
          }
          return results;
        }

        // We discarded unacceptable values. So we just need to verify if translationId is empty String
        if (angular.isString(translationId) && translationId.length < 1) {
          return translationId;
        }

        // trim off any whitespace
        if (translationId) {
          translationId = trim.apply(translationId);
        }

        var result, possibleLangKeys = [];
        if ($preferredLanguage) {
          possibleLangKeys.push($preferredLanguage);
        }
        if ($uses) {
          possibleLangKeys.push($uses);
        }
        if ($fallbackLanguage && $fallbackLanguage.length) {
          possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
        }
        for (var j = 0, d = possibleLangKeys.length; j < d; j++) {
          var possibleLangKey = possibleLangKeys[j];
          if ($translationTable[possibleLangKey]) {
            if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
              result = determineTranslationInstant(translationId, interpolateParams, interpolationId);
            }
          }
          if (typeof result !== 'undefined') {
            break;
          }
        }

        if (!result && result !== '') {
          // Return translation of default interpolator if not found anything.
          result = defaultInterpolator.interpolate(translationId, interpolateParams);
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            result = translateByHandler(translationId);
          }
        }

        return result;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#versionInfo
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the current version information for the angular-translate library
       *
       * @return {string} angular-translate version
       */
      $translate.versionInfo = function () {
        return version;
      };

      /**
       * @ngdoc function
       * @name pascalprecht.translate.$translate#loaderCache
       * @methodOf pascalprecht.translate.$translate
       *
       * @description
       * Returns the defined loaderCache.
       *
       * @return {boolean|string|object} current value of loaderCache
       */
      $translate.loaderCache = function () {
        return loaderCache;
      };

      if ($loaderFactory) {

        // If at least one async loader is defined and there are no
        // (default) translations available we should try to load them.
        if (angular.equals($translationTable, {})) {
          $translate.use($translate.use());
        }

        // Also, if there are any fallback language registered, we start
        // loading them asynchronously as soon as we can.
        if ($fallbackLanguage && $fallbackLanguage.length) {
          var processAsyncResult = function (translation) {
            translations(translation.key, translation.table);
            $rootScope.$emit('$translateChangeEnd', { language: translation.key });
            return translation;
          };
          for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
            langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]).then(processAsyncResult);
          }
        }
      }

      return $translate;
    }
  ];
}]);

/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateDefaultInterpolation
 * @requires $interpolate
 *
 * @description
 * Uses angular's `$interpolate` services to interpolate strings against some values.
 *
 * @return {object} $translateInterpolator Interpolator service
 */
angular.module('pascalprecht.translate').factory('$translateDefaultInterpolation', ['$interpolate', function ($interpolate) {

  var $translateInterpolator = {},
      $locale,
      $identifier = 'default',
      $sanitizeValueStrategy = null,
      // map of all sanitize strategies
      sanitizeValueStrategies = {
        escaped: function (params) {
          var result = {};
          for (var key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              result[key] = angular.element('<div></div>').text(params[key]).html();
            }
          }
          return result;
        }
      };

  var sanitizeParams = function (params) {
    var result;
    if (angular.isFunction(sanitizeValueStrategies[$sanitizeValueStrategy])) {
      result = sanitizeValueStrategies[$sanitizeValueStrategy](params);
    } else {
      result = params;
    }
    return result;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateDefaultInterpolation#setLocale
   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
   *
   * @description
   * Sets current locale (this is currently not use in this interpolation).
   *
   * @param {string} locale Language key or locale.
   */
  $translateInterpolator.setLocale = function (locale) {
    $locale = locale;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateDefaultInterpolation#getInterpolationIdentifier
   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
   *
   * @description
   * Returns an identifier for this interpolation service.
   *
   * @returns {string} $identifier
   */
  $translateInterpolator.getInterpolationIdentifier = function () {
    return $identifier;
  };

  $translateInterpolator.useSanitizeValueStrategy = function (value) {
    $sanitizeValueStrategy = value;
    return this;
  };

  /**
   * @ngdoc function
   * @name pascalprecht.translate.$translateDefaultInterpolation#interpolate
   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
   *
   * @description
   * Interpolates given string agains given interpolate params using angulars
   * `$interpolate` service.
   *
   * @returns {string} interpolated string.
   */
  $translateInterpolator.interpolate = function (string, interpolateParams) {
    if ($sanitizeValueStrategy) {
      interpolateParams = sanitizeParams(interpolateParams);
    }
    return $interpolate(string)(interpolateParams || {});
  };

  return $translateInterpolator;
}]);

angular.module('pascalprecht.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');

angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translate
 * @requires $compile
 * @requires $filter
 * @requires $interpolate
 * @restrict A
 *
 * @description
 * Translates given translation id either through attribute or DOM content.
 * Internally it uses `translate` filter to translate translation id. It possible to
 * pass an optional `translate-values` object literal as string into translation id.
 *
 * @param {string=} translate Translation id which could be either string or interpolated string.
 * @param {string=} translate-values Values to pass into translation id. Can be passed as object literal string or interpolated object.
 * @param {string=} translate-attr-ATTR translate Translation id and put it into ATTR attribute.
 * @param {string=} translate-default will be used unless translation was successful
 * @param {boolean=} translate-compile (default true if present) defines locally activation of {@link pascalprecht.translate.$translate#usePostCompiling}
 *
 * @example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre translate="TRANSLATION_ID"></pre>
        <pre translate>TRANSLATION_ID</pre>
        <pre translate translate-attr-title="TRANSLATION_ID"></pre>
        <pre translate="{{translationId}}"></pre>
        <pre translate>{{translationId}}</pre>
        <pre translate="WITH_VALUES" translate-values="{value: 5}"></pre>
        <pre translate translate-values="{value: 5}">WITH_VALUES</pre>
        <pre translate="WITH_VALUES" translate-values="{{values}}"></pre>
        <pre translate translate-values="{{values}}">WITH_VALUES</pre>
        <pre translate translate-attr-title="WITH_VALUES" translate-values="{{values}}"></pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations('en',{
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
        }).preferredLanguage('en');

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
    <file name="scenario.js">
      it('should translate', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';

          element = $compile('<p translate="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate="{{translationId}}"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>TRANSLATION_ID</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>{{translationId}}</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate translate-attr-title="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.attr('title')).toBe('Hello there!');
        });
      });
    </file>
   </example>
 */
.directive('translate', ['$translate', '$q', '$interpolate', '$compile', '$parse', '$rootScope', function ($translate, $q, $interpolate, $compile, $parse, $rootScope) {

  return {
    restrict: 'AE',
    scope: true,
    compile: function (tElement, tAttr) {

      var translateValuesExist = (tAttr.translateValues) ?
        tAttr.translateValues : undefined;

      var translateInterpolation = (tAttr.translateInterpolation) ?
        tAttr.translateInterpolation : undefined;

      var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);

      var interpolateRegExp = "^(.*)(" + $interpolate.startSymbol() + ".*" + $interpolate.endSymbol() + ")(.*)",
          watcherRegExp = "^(.*)" + $interpolate.startSymbol() + "(.*)" + $interpolate.endSymbol() + "(.*)";

      return function linkFn(scope, iElement, iAttr) {

        scope.interpolateParams = {};
        scope.preText = "";
        scope.postText = "";
        var translationIds = {};

        // Ensures any change of the attribute "translate" containing the id will
        // be re-stored to the scope's "translationId".
        // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
        var observeElementTranslation = function (translationId) {
          if (angular.equals(translationId , '') || !angular.isDefined(translationId)) {
            // Resolve translation id by inner html if required
            var interpolateMatches = iElement.text().match(interpolateRegExp);
            // Interpolate translation id if required
            if (angular.isArray(interpolateMatches)) {
              scope.preText = interpolateMatches[1];
              scope.postText = interpolateMatches[3];
              translationIds.translate = $interpolate(interpolateMatches[2])(scope.$parent);
              watcherMatches = iElement.text().match(watcherRegExp);
              if (angular.isArray(watcherMatches) && watcherMatches[2] && watcherMatches[2].length) {
                scope.$watch(watcherMatches[2], function (newValue) {
                  translationIds.translate = newValue;
                  updateTranslations();
                });
              }
            } else {
              translationIds.translate = iElement.text().replace(/^\s+|\s+$/g,'');
            }
          } else {
            translationIds.translate = translationId;
          }
          updateTranslations();
        };

        var observeAttributeTranslation = function (translateAttr) {
          iAttr.$observe(translateAttr, function (translationId) {
            translationIds[translateAttr] = translationId;
            updateTranslations();
          });
        };

        iAttr.$observe('translate', function (translationId) {
          observeElementTranslation(translationId);
        });

        for (var translateAttr in iAttr) {
          if(iAttr.hasOwnProperty(translateAttr) && translateAttr.substr(0, 13) === 'translateAttr') {
            observeAttributeTranslation(translateAttr);
          }
        }

        iAttr.$observe('translateDefault', function (value) {
          scope.defaultText = value;
        });

        if (translateValuesExist) {
          iAttr.$observe('translateValues', function (interpolateParams) {
            if (interpolateParams) {
              scope.$parent.$watch(function () {
                angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
              });
            }
          });
        }

        if (translateValueExist) {
          var observeValueAttribute = function (attrName) {
            iAttr.$observe(attrName, function (value) {
              var attributeName = angular.lowercase(attrName.substr(14, 1)) + attrName.substr(15);
              scope.interpolateParams[attributeName] = value;
            });
          };
          for (var attr in iAttr) {
            if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
              observeValueAttribute(attr);
            }
          }
        }

        // Master update function
        var updateTranslations = function () {
          for (var key in translationIds) {
            if (translationIds.hasOwnProperty(key) && translationIds[key]) {
              updateTranslation(key, translationIds[key], scope, scope.interpolateParams);
            }
          }
        };

        // Put translation processing function outside loop
        var updateTranslation = function(translateAttr, translationId, scope, interpolateParams) {
          $translate(translationId, interpolateParams, translateInterpolation)
            .then(function (translation) {
              applyTranslation(translation, scope, true, translateAttr);
            }, function (translationId) {
              applyTranslation(translationId, scope, false, translateAttr);
            });
        };

        var applyTranslation = function (value, scope, successful, translateAttr) {
          if (translateAttr === 'translate') {
            // default translate into innerHTML
            if (!successful && typeof scope.defaultText !== 'undefined') {
              value = scope.defaultText;
            }
            iElement.html(scope.preText + value + scope.postText);
            var globallyEnabled = $translate.isPostCompilingEnabled();
            var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
            var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
            if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
              $compile(iElement.contents())(scope);
            }
          } else {
            // translate attribute
            if (!successful && typeof scope.defaultText !== 'undefined') {
              value = scope.defaultText;
            }
            var attributeName = iAttr.$attr[translateAttr].substr(15);
            iElement.attr(attributeName, value);
          }
        };

        scope.$watch('interpolateParams', updateTranslations, true);

        // Ensures the text will be refreshed after the current language was changed
        // w/ $translate.use(...)
        var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslations);

        // ensure translation will be looked up at least one
        if (iElement.text().length) {
          observeElementTranslation('');
        }
        updateTranslations();
        scope.$on('$destroy', unbind);
      };
    }
  };
}]);

angular.module('pascalprecht.translate')
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translateCloak
 * @requires $rootScope
 * @requires $translate
 * @restrict A
 *
 * $description
 * Adds a `translate-cloak` class name to the given element where this directive
 * is applied initially and removes it, once a loader has finished loading.
 *
 * This directive can be used to prevent initial flickering when loading translation
 * data asynchronously.
 *
 * The class name is defined in
 * {@link pascalprecht.translate.$translateProvider#cloakClassName $translate.cloakClassName()}.
 *
 * @param {string=} translate-cloak If a translationId is provided, it will be used for showing
 *                                  or hiding the cloak. Basically it relies on the translation
 *                                  resolve.
 */
.directive('translateCloak', ['$rootScope', '$translate', function ($rootScope, $translate) {

  return {
    compile: function (tElement) {
      var applyCloak = function () {
        tElement.addClass($translate.cloakClassName());
      },
      removeCloak = function () {
        tElement.removeClass($translate.cloakClassName());
      },
      removeListener = $rootScope.$on('$translateChangeEnd', function () {
        removeCloak();
        removeListener();
        removeListener = null;
      });
      applyCloak();

      return function linkFn(scope, iElement, iAttr) {
        // Register a watcher for the defined translation allowing a fine tuned cloak
        if (iAttr.translateCloak && iAttr.translateCloak.length) {
          iAttr.$observe('translateCloak', function (translationId) {
            $translate(translationId).then(removeCloak, applyCloak);
          });
        }
      };
    }
  };
}]);

angular.module('pascalprecht.translate')
/**
 * @ngdoc filter
 * @name pascalprecht.translate.filter:translate
 * @requires $parse
 * @requires pascalprecht.translate.$translate
 * @function
 *
 * @description
 * Uses `$translate` service to translate contents. Accepts interpolate parameters
 * to pass dynamized values though translation.
 *
 * @param {string} translationId A translation id to be translated.
 * @param {*=} interpolateParams Optional object literal (as hash or string) to pass values into translation.
 *
 * @returns {string} Translated text.
 *
 * @example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre>{{ 'TRANSLATION_ID' | translate }}</pre>
        <pre>{{ translationId | translate }}</pre>
        <pre>{{ 'WITH_VALUES' | translate:'{value: 5}' }}</pre>
        <pre>{{ 'WITH_VALUES' | translate:values }}</pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations('en', {
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
        });
        $translateProvider.preferredLanguage('en');

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
   </example>
 */
.filter('translate', ['$parse', '$translate', function ($parse, $translate) {
  var translateFilter = function (translationId, interpolateParams, interpolation) {

    if (!angular.isObject(interpolateParams)) {
      interpolateParams = $parse(interpolateParams)(this);
    }

    return $translate.instant(translationId, interpolateParams, interpolation);
  };

  // Since AngularJS 1.3, filters which are not stateless (depending at the scope)
  // have to explicit define this behavior.
  translateFilter.$stateful = true;

  return translateFilter;
}]);
})();