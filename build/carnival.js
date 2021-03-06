angular.module('carnival', [
  'carnival.templates',
  'ui.router',
  'carnival.components',
  'datePicker',
  'duScroll',
  'ngWig',
  'angular-loading-bar'
])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {

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
  Configuration.addExtraStates();
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

angular.module('carnival.components.column-form', [])
.directive('carnivalColumnForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      state: '@state',
      type: '@'
    },
    templateUrl: 'components/column-form/column-form.html',
    controller: ["$scope", function ($scope) {


    }]
  };
});

angular.module('carnival.components.column-listing', [])
.directive('carnivalColumnListing', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      entity: '=',
      field: '=',
      identifier: '='
    },
    templateUrl: 'components/column-listing/column-listing.html',
    controller: ["$scope", "FormService", "Configuration", "EntityResources", function($scope, FormService, Configuration, EntityResources){

      $scope.cssClass = 'fadeInRight';
      $scope.style = {
        zIndex: (FormService.columnsCount() * 10) + 2,
        left: (FormService.columnsCount() * 20) + 'px',
        top: (FormService.columnsCount() * 30) + 'px',
        padding: '10px'
      };

      $scope.getListFields = function(){
        var fields = [];

        for(var i = 0; i < $scope.entity.fields.length; i++){
          var f = $scope.entity.fields[i];
          if(f.type !== 'belongsTo' && f.type !== 'hasMany')
            fields.push(f);
        }

        return fields;
      };
    }]
  };
});

angular.module('carnival.components', [
  'carnival.components.button',
  'carnival.components.form-column',
  'carnival.components.has-many-table',
  'carnival.components.has-many-select',
  'carnival.components.column-form',
  'carnival.components.column-listing',
  'carnival.components.form-area',
  'carnival.components.form',
  'carnival.components.form-fields',
  'carnival.components.show-fields',
  'carnival.components.field-form-builder',
  'carnival.components.form-fields-next',
  'carnival.components.nested-form',
  'carnival.components.summarized-items',
  'carnival.components.delete-button',
  'carnival.components.listing',
  'carnival.components.listingfieldbelongsto',
  'carnival.components.listingextraaction',
  'carnival.components.listingfieldhasmany',
  'carnival.components.listingfieldboolean',
  'carnival.components.listingfield',
  'carnival.components.navbar',
  'carnival.components.fields',
  'carnival.components.order-controller',
  'carnival.components.pagination-controller',
  'carnival.components.search-controller',
  'carnival.components.notification',
  'carnival.components.quickfilter-controller',
  'carnival.components.listingFieldFile',
  'carnival.components.listingFieldCurrency',
  'carnival.components.listingFieldDate',
  'carnival.components.uploader',
  'carnival.components.gallery',
  'carnival.components.listingFieldEnum',
  'carnival.components.showBoolean',
  'carnival.components.showCurrency',
  'carnival.components.showDate',
  'carnival.components.showEnum',
  'carnival.components.showFile',
  'carnival.components.showHasMany',
  'carnival.components.showString',
  'carnival.components.showWysiwyg'
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
    controller: ["$scope", "$filter", function ($scope, $filter) {

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

    }]
  };
});

angular.module('carnival.components.field-form-builder', [])
.directive('carnivalFieldFormBuilder', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      parentEntity: '=',
      field: '=',
      data: '=',
      state: '@',
      label: '@'
    },
    templateUrl: 'components/field-form-builder/field-form-builder.html',
    controller: ["$rootScope", "$scope", "$timeout", "utils", "$element", "$compile", "FormService", "Configuration", "EntityResources", "Notification", "$filter", "$state", function ($rootScope, $scope, $timeout, utils, $element,  $compile, FormService, Configuration, EntityResources, Notification, $filter, $state) {

      var getContainerId = function(state){
        var nestedType = $scope.field.views[state].nested;
        if(nestedType.type === 'column'){
          return '#form-columns';
        }else{
          var prefix = '';
          if(state === 'edit' )
            prefix = '_' + $scope.data[$scope.field.identifier];
          return '#'+state+'_nested_'+ $scope.field.entityName +  prefix;
        }
      };

      var resolveForeignKey = function(entity){
        if(!$scope.parentEntity) return;

        var f = entity.model.getFieldByEntityName($scope.parentEntity.name);

        if(!f) return;

        if(f.type === 'hasMany' || f.type === 'belongsTo'){
          entity.datas[f.foreignKey] = $scope.parentEntity.datas[$scope.parentEntity.identifier];
        }
      };

      $scope._openForm = function(entity, state){
        var containerId = getContainerId(state);

        resolveForeignKey(entity);

        var formScope = $scope.$new();
        formScope.entity = entity;
        formScope.state = state;

        var nestedType = $scope.field.views[state].nested;
        if(nestedType.type === 'column'){
          FormService.openColumn(state, containerId, formScope);
        }else{
          FormService.openNested(state, containerId, formScope);
        }
      };

      $scope.getButtonLabel = function(){
        if($scope.label)
          return $scope.label;

        if($scope.state === 'edit')
          return 'Edit';
      };

      $scope.openWithData = function(){
        var entity = EntityResources.prepareForEditState($scope.field.entityName, $scope.parentEntity);
        var identifier = entity.identifier;
        var id = $scope.data[identifier];
        entity.model.getOne(id)
        .success(function (data) {
          entity[identifier] = id;
          entity.datas = data;
          $scope._openForm(entity, 'edit');
        });
      };

      $scope.open = function(){
        var entity = EntityResources.prepareForCreateState($scope.field.entityName, $scope.parentEntity);
        $scope._openForm(entity, 'create');
      };

      $scope.delete = function (item) {
        var entity = EntityResources.prepareForListState($scope.field.entityName);
        entity.model.delete(item)
        .success(function () {
          var message = $filter('translate')('DELETED_SUCCESS_MESSAGE');
          new Notification(message, 'warning');
          $state.reload();
        })
        .error(function (data) {
          new Notification(data, 'danger');
        });
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
      parentEntity: '=',
      state: '@',
      relatedResources: '='
    },
    templateUrl: 'components/fields/belongs-to/belongs-to.html',
    controller: ["$scope", function($scope){
      $scope.hasNested = function(){
        var viewProp = $scope.field.views[$scope.state];
        return (viewProp && viewProp.nested);
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
      data: '='
    },
    templateUrl: 'components/fields/boolean/boolean.html',
    controller: ["$scope", function($scope){
      if($scope.data === undefined)
        $scope.data = false;
    }]
  };
});

angular.module('carnival.components.fields.currency', [])
.directive('carnivalCurrencyField', ["$filter", function ($filter) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/fields/currency/currency.html'
  };
}])
.directive('currency', ["$parse", function ($parse) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ctrl) {
      if (!ctrl) {
        return;
      }

      function clearDelimitersAndLeadingZeros (value) {
        var cleanValue = value.replace(/^-/,'').replace(/^0*/, '');
        cleanValue = cleanValue.replace(/[^0-9]/g, '');
        return cleanValue;
      }

      function prepareNumberToFormatter (value, decimals) {
        return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
      }

      var decimalDelimiter   = scope.field.options.decimalDelimiter || '.',
          thousandsDelimiter = scope.field.options.thousandsDelimiter || '',
          currencySym        = scope.field.options.symbol || '$',
          decimals           = parseInt(scope.field.options.decimals, 10);

      if (isNaN(decimals)) {
        decimals = 2;
      }

      var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
      var maskPattern     = currencySym + ' #' + thousandsDelimiter + '##0' + decimalsPattern;
      var moneyMask       = new StringMask(maskPattern, {reverse: true});

      ctrl.$formatters.push(function (value) {
        if(angular.isUndefined(value)) {
          return value;
        }
        var valueToFormat = prepareNumberToFormatter(value, decimals);
        return moneyMask.apply(valueToFormat);
      });

      function parse (value) {
        if (!value) {
          return null;
        }
        var actualNumber = value.replace(/[^\d]+/g,'');
        actualNumber = actualNumber.replace(/^[0]+([1-9])/,'$1');
        var formatedValue = moneyMask.apply(actualNumber);
        if (value !== formatedValue) {
          ctrl.$setViewValue(formatedValue);
          ctrl.$render();
        }
        return formatedValue ? parseInt(formatedValue.replace(/[^\d]+/g,''))/Math.pow(10,decimals) : null;
      }

      ctrl.$parsers.push(parse);

    }
  };
}]);

angular.module('carnival.components.fields.date', [])
.directive('carnivalDateField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/fields/date/date.html'
  };
});

angular.module('carnival.components.fields.enum', [])
.directive('carnivalEnumField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/fields/enum/enum.html'
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
  'carnival.components.fields.date',
  'carnival.components.fields.file',
  'carnival.components.fields.enum',
  'carnival.components.fields.currency'
]);

angular.module('carnival.components.fields.file', [])
.directive('carnivalFileField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '='
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
      state: '@',
      parentEntity: '=',
      relatedResources: '='
    },
    templateUrl: 'components/fields/has-many/has-many.html',
    controller: ["$rootScope", "$scope", "utils", "Configuration", "$compile", "$element", "$document", "$filter", function ($rootScope, $scope, utils, Configuration, $compile, $element, $document, $filter) {

      var init = function(){
        $scope.utils = utils;
      };

      $scope.hasNested = function(){
        var viewProp = $scope.field.views[$scope.state];
        return (viewProp && viewProp.nested);
      };

      $scope.showOptions = function(){
        var fieldEntity = Configuration.getEntity($scope.field.entityName);
        var relationField = fieldEntity.getFieldByEntityName($scope.parentEntity.name);
        if(relationField && relationField.type === 'belongsTo' && !$scope.field.views[$scope.state].showOptions)
          return false;

        return true;
      };

      $scope.showAs = function(){
        return $scope.field.showAs;
      };

      var getItemIndex = function(id, items){
        for(var i = 0; i < items.length; i++){
          if(items[i].id === id)
            return i;
        }
        return -1;
      };

      var deleteIfNeeded = function(id){
        if($scope.field.views[$scope.state].enableDelete){
          var fieldEntity = Configuration.getEntity($scope.field.entityName);
          fieldEntity.delete(id)
          .success(function () {
            var message = $filter('translate')('DELETED_SUCCESS_MESSAGE');
            new Notification(message, 'warning');
          })
          .error(function (data) {
            new Notification(data, 'danger');
          });
        }
      };

      $scope.remove = function(id){
        var items = $scope.datas;
        var index = getItemIndex(id, items);
        if(index < 0)
          return;
        items.splice(index, 1);

        deleteIfNeeded(id);
      };

      init();
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
      data: '='
    },
    templateUrl: 'components/fields/number/number.html'
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
      identifier: '='
    },
    templateUrl: 'components/fields/select/select.html'
  };
});

angular.module('carnival.components.fields.string', [])
.directive('carnivalStringField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '='
    },
    templateUrl: 'components/fields/string/string.html'
  };
});

angular.module('carnival.components.fields.text', [])
.directive('carnivalTextField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '='
    },
    templateUrl: 'components/fields/text/text.html'
  };
});

angular.module('carnival.components.fields.wysiwyg', [])
.directive('carnivalWysiwygField', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      label: '=',
      data: '='
    },
    templateUrl: 'components/fields/wysiwyg/wysiwyg.html'
  };
});

angular.module('carnival.components.form-area', [])
.directive('carnivalFormArea', function () {
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
    templateUrl: 'components/form-area/form-area.html',
    controller: ["$rootScope", "$scope", "FormService", function ($rootScope, $scope, FormService) {
      FormService.init();
      $scope.getDisableClass = function(){
        if(FormService.columnsCount() > 0)
          return 'disable-form';
        return '';
      };
    }]
  };
});

angular.module('carnival.components.form-column', [])
.directive('carnivalFormColumn', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      field: '=',
      datas: '=',
      state: '@state',
      type: '@',
      index: '@'
    },
    templateUrl: 'components/form-column/form-column.html',
    controller: ["$rootScope", "$scope", "utils", "FormService", "$element", "EntityResources", "EntityUpdater", "$timeout", "$document", function ($rootScope, $scope, utils, FormService, $element, EntityResources, EntityUpdater, $timeout, $document) {

      var getName = function(){
        return $scope.type + '-' + $scope.entity.name;
      };

      $timeout(function(){
        $document.scrollTop(0);
        $scope.cssClass = 'fadeInRight';
      }, 10);

      $scope.getDisableClass = function(){
        if(FormService.columnsCount() > parseInt($scope.index) + 1){
          return 'disable-form';
        }
        return '';
      };

      $scope.remove = function(){
        $scope.cssClass = 'fadeOutRight';

        $timeout(function(){
          $element.remove();
        }, 1000);
      };

      $scope.isClosed = function(){
        return !FormService.columns[getName()];
      };

      $scope.close = function(){
        FormService.closeColumn(getName());
      };

      $scope.$watch('isClosed()', function(newValue, oldValue){
        if(newValue === oldValue)
            return;
        if(newValue){
          $scope.remove();
        }
      });

    }]
  };
});

angular.module('carnival.components.form-fields-next', [])
.directive('carnivalFormFieldsNext', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'components/form-fields-next/form-fields-next.html'
  };
});

angular.module('carnival.components.form-fields', [])
.directive('carnivalFormFields', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'components/form-fields/form-fields.html'
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
      relatedResources: '='
    },
    templateUrl: 'components/form/form.html',
    controller: ["Notification", "$document", "$scope", "utils", "FormService", "EntityResources", "EntityUpdater", "$state", "$filter", function (Notification, $document, $scope, utils, FormService, EntityResources, EntityUpdater, $state, $filter) {

      $scope.hasRelatedFields = function(){
        for(var i = 0; i < $scope.fields.length; i++){
          var field = $scope.fields[i];
          if(field.fieldFormType !== 'related')
            continue;
          return true;
        }
        return false;
      };

      $scope.showRelatedFields = function(){
        if(!$scope.hasRelatedFields())
           return false;
         if($scope.state === 'create')
           return false;
         return true;
      };

      $scope.initSelectedTab = function(index){
        if(!$scope.selectedTab)
          $scope.selectedTab = index;
      };

      $scope.selectTab = function(index){
        $scope.selectedTab = index;
      };

      $scope.getTabClass = function(index){
        if($scope.selectedTab === index)
          return 'active';
      };

      var updateEntityData = function(data){
        var parentEntity = $scope.entity.parentEntity;
        var identifier = $scope.entity.identifier;
        $scope.entity[identifier] = data[identifier];
        $scope.entity.datas = data;
        if(!parentEntity)
          return;
        var fieldToUpdate = parentEntity.model.getFieldByEntityName($scope.entity.name);
        EntityUpdater.updateEntity(parentEntity, fieldToUpdate, data);
      };

      var updateEntity = function(data){
        var parentEntity = $scope.entity.parentEntity;
        $scope.entity = EntityResources.prepareForEditState($scope.entity.name, parentEntity);
        $scope.entity.parentEntity = parentEntity;
        updateEntityData(data);
      };

      var goToEdit = function(data){
        var message = $filter('translate')('CREATE_RELATIONS_MESSAGE');
        message = $scope.entity.label + message;
        new Notification(message, 'success');
        if($scope.type === 'normal')
          $state.go('main.edit', { entity: $scope.entity.name, id: data.id});
        else
          $scope.state = 'edit';

        $document.scrollTop(window.innerHeight, 1000);
      };

      var successCallback = function(data){
        $scope.errors = [];
        updateEntity(data);
        if($scope.hasRelatedFields() && $scope.state === 'create'){
          goToEdit(data);
        }else{
          FormService.goToNextStep($scope.entity.name, $scope.type);
          var successMessage = $filter('translate')('UPDATED_SUCCESS_MESSAGE');
          new Notification(successMessage, 'success');
        }
      };

      var saveCallback = function(error, data){
        if(!error){
          successCallback(data);
        }else{
          if(!angular.isArray(data))
            data = [data];
          for(var i = 0; i < data.length; i++){
            new Notification(data[i], 'alert');
          }
        }
      };

      $scope.saveButtonClass = $scope.type === 'nested' ? 'tiny button-submit' : 'small button-submit';

      $scope.buttonAction = function(){
        var callbackFunction = saveCallback;
        $scope.action.click(callbackFunction);
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
    controller: ["$scope", "$injector", function ($scope, $injector) {
      if (!window.CARNIVAL) window.CARNIVAL = {};
      if (!window.CARNIVAL.gallery) window.CARNIVAL.gallery = {};
      window.CARNIVAL.gallery.sendUrl = function (url) {
        $scope.fileUrl = url;
        $scope.$parent.$parent.$apply();
      };
      $scope.open = function () {
        var url;
        if (typeof $scope.gallery.url === 'function') {
          url = $scope.gallery.url($injector);
        } else {
          url = $scope.gallery.url;
        }
        var params = 'dialog';
        if ($scope.gallery.width) params += ',WIDTH=' + $scope.gallery.width;
        if ($scope.gallery.height) params += ',HEIGHT=' + $scope.gallery.height;
        window.open(url, 'WINDOW_GALLERY', params);
      };
    }],
    templateUrl: 'components/gallery/gallery.html'
  };
});

angular.module('carnival.components.has-many-select', [])
.directive('carnivalHasManySelect', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      datas: '=',
      field: '=',
      parentEntity: '=',
      relatedResources: '='
    },
    templateUrl: 'components/has-many-select/has-many-select.html',
    controller: ["$rootScope", "$scope", "utils", "Configuration", function ($rootScope, $scope, utils, Configuration) {
      var init = function(){
        if(!$scope.datas)
          $scope.datas = [];
      };

      var isInDatas = function(item){
        if(!$scope.datas)
          $scope.datas = [];
        var fieldEntity = Configuration.getEntity($scope.field.entityName);
        var identifier = fieldEntity.identifier;
        for(var i = 0; i < $scope.datas.length; i++){
          var data = $scope.datas[i];
          if(item[identifier] === data[identifier])
            return true;
        }
        return false;
      };

      $scope.getAvailableResources = function(){
        var resources = [];
        if(!$scope.relatedResources)
          return resources;
        for(var i = 0; i < $scope.relatedResources.length; i++){
          var resource = $scope.relatedResources[i];
          if(!isInDatas(resource))
            resources.push(resource);
        }
        return resources;
      };

      var getSelectedItem = function(){
        var items = $scope.getAvailableResources();
        var index = $scope.selectedHasMany;
        if(index >= 0)
          return items[index];
      };

      $scope.addHasManyOption = function(){
        var selectedItem = getSelectedItem();

        if(selectedItem){
          $scope.datas.push(selectedItem);
        }
      };

      init();

    }]
  };
});

angular.module('carnival.components.has-many-table', [])
.directive('carnivalHasManyTable', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      parentEntity: '=',
      field: '=',
      datas: '=',
      hasNested: '=',
      state: '@',
      editable: '='
    },
    templateUrl: 'components/has-many-table/has-many-table.html',
    controller: ["$rootScope", "$scope", "$compile", "utils", "$element", "FormService", "Configuration", "EntityResources", function ($rootScope, $scope, $compile, utils, $element, FormService, Configuration, EntityResources) {

      $scope.getListFields = function(){
        var fields = [];

        for(var i = 0; i < $scope.entity.fields.length; i++){
          var f = $scope.entity.fields[i];
          if(f.type !== 'belongsTo' && f.type !== 'hasMany')
            fields.push(f);
        }

        return fields;
      };

      var init = function(){
        $scope.entity = EntityResources.prepareForListState($scope.field.name, $scope.parentEntity);
      };

      init();
    }]
  };
});

angular.module('carnival.components.listingextraaction', [])
.directive('carnivalListingExtraAction', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      extraAction: '=',
      item: '='
    },
    templateUrl: 'components/listing-extra-action/listing-extra-action.html',
    controller: ["$scope", "$stateParams", "Configuration", "$injector", function($scope, $stateParams, Configuration, $injector){

      var replaceWithParams = function(url){
        var regex =  /\/:([a-z]*)($ || \/)/;
        var regexResult = regex.exec(url);
        if(regexResult === null){
          return url;
        }

        var paramName = regexResult[1];
        var paramValue = $scope.item[paramName];
        return url.replace(regex, '/' + paramValue);
      };

      var parseUrl = function(){
        var url = $scope.extraAction.url;
        var index = 0;
        while(url.indexOf('\/:') >= 0){
          url = replaceWithParams(url);
        }
        return url;
      };

      $scope.getUrl = function(){
        return parseUrl();
      };

      $scope.getLabel = function(){
        return $scope.extraAction.label;
      };

      $scope.executeAction = function () {
        $scope.extraAction.action($scope.item, $injector);
      };
    }]
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

angular.module('carnival.components.listingfieldboolean', [])
.directive('carnivalListingFieldBoolean', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-boolean/listing-field-boolean.html'
  };
});

angular.module('carnival.components.listingFieldCurrency', [])
.directive('carnivalListingFieldCurrency', function () {
  return {
    restrict: 'E',
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-currency/listing-field-currency.html',
    link: function (scope) {
      scope.toCurrency = function (value) {

        function clearDelimitersAndLeadingZeros (value) {
          var cleanValue = value.replace(/^-/,'').replace(/^0*/, '');
          cleanValue = cleanValue.replace(/[^0-9]/g, '');
          return cleanValue;
        }

        function prepareNumberToFormatter (value, decimals) {
          return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
        }

        var decimalDelimiter   = scope.field.options.decimalDelimiter || '.',
            thousandsDelimiter = scope.field.options.thousandsDelimiter || '',
            currencySym        = scope.field.options.symbol || '$',
            decimals           = parseInt(scope.field.options.decimals, 10);

            if (isNaN(decimals)) {
              decimals = 2;
            }

        var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
        var maskPattern     = currencySym + ' #' + thousandsDelimiter + '##0' + decimalsPattern;
        var moneyMask       = new StringMask(maskPattern, {reverse: true});

        var valueToFormat = prepareNumberToFormatter(value, decimals);
        return moneyMask.apply(valueToFormat);
      };
    }
  };
});

angular.module('carnival.components.listingFieldDate', [])
.directive('carnivalListingFieldDate', ["$filter", function ($filter) {
  return {
    restrict: 'E',
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-date/listing-field-date.html',
    link: function (scope) {
      scope.toDate = function (dateStr) {
        var date = new Date(dateStr);
        return $filter('date')(date, 'dd/MM/yyyy HH:mm:ss');
      };
    }
  };
}]);

angular.module('carnival.components.listingFieldEnum', [])
.directive('carnivalListingFieldEnum', function () {
  return {
    restrict: 'E',
    scope: {
      item: '=',
      field: '='
    },
    templateUrl: 'components/listing-field-enum/listing-field-enum.html',
    link: function (scope, elem, attrs) {
      scope.getValue = function (item) {
        for (var i = 0, x = scope.field.values.length; i < x; i += 1) {
          if (scope.field.values[i].value === item) {
            return scope.field.values[i].label;
          }
        }
      };
    }
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
      extraActions: '=',
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
    controller: ["$scope", "$state", "$stateParams", "urlParams", "$location", function ($scope, $state, $stateParams, urlParams, $location) {
    
      var urlPrefix = "#";
      if($location.$$html5){
        urlPrefix = "";
      }

      $scope.buildUrl = function (link) {
        if (link.type === 'entity') return urlPrefix + '/list/' + link.url;
        if (link.type === 'state')  return urlPrefix + '/' + link.url;
        if (link.type === 'url')    return link.url;
        return '#';
      };

      $scope.checkSelEntity = function (index) {
        var url = $state.current.url.replace(':entity', $stateParams.entity);
        if (url.indexOf($scope.menuItems[index].link.url) > -1) {
          return true;
        } else {
          return false;
        }
      };
    }]
  };
});

angular.module('carnival.components.nested-form', [])
.directive('carnivalNestedForm', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      entity: '=',
      state: '@',
      editable: '='
    },
    templateUrl: 'components/nested-form/nested-form.html',
    controller: ["$rootScope", "$scope", "utils", "$element", "FormService", function ($rootScope, $scope, utils, $element, FormService) {

      $scope.isClosed = function(){
        return !FormService.nesteds[$scope.entity.name];
      };

      $scope.close = function(){
        FormService.closeNested($scope.entity.name);
      };

      $scope.$watch('isClosed()', function(newValue, oldValue){
        if(newValue === oldValue)
            return;
        if(newValue){
          $element.remove();
        }
      });
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

angular.module('carnival.components.showBoolean', [])
.directive('carnivalShowBoolean', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/boolean/boolean.html'  
  };
});

angular.module('carnival.components.showCurrency', [])
.directive('carnivalShowCurrency', ["$filter", function ($filter) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/show-fields/currency/currency.html',
    link: function (scope) {
      scope.toCurrency = function (value) {
        
        function clearDelimitersAndLeadingZeros (value) {
          var cleanValue = value.replace(/^-/,'').replace(/^0*/, '');
          cleanValue = cleanValue.replace(/[^0-9]/g, '');
          return cleanValue;
        }

        function prepareNumberToFormatter (value, decimals) {
          return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
        }

        var decimalDelimiter   = scope.field.options.decimalDelimiter || '.',
            thousandsDelimiter = scope.field.options.thousandsDelimiter || '',
            currencySym        = scope.field.options.symbol || '$',
            decimals           = parseInt(scope.field.options.decimals, 10);

        if (isNaN(decimals)) {
          decimals = 2;

        }

        var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
        var maskPattern     = currencySym + ' #' + thousandsDelimiter + '##0' + decimalsPattern;
        var moneyMask       = new StringMask(maskPattern, {reverse: true});

        var valueToFormat = prepareNumberToFormatter(value, decimals);
        return moneyMask.apply(valueToFormat);
      };
    }
  };
}]);


angular.module('carnival.components.showDate', [])
.directive('carnivalShowDate', ["$filter", function ($filter) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/date/date.html',
    link: function (scope) {
      scope.toDate = function (dateStr) {
        var date = new Date(dateStr);
        return $filter('date')(date, 'dd/MM/yyyy HH:mm:ss');
      };
    }
  };
}]);

angular.module('carnival.components.showEnum', [])
.directive('carnivalShowEnum', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/show-fields/enum/enum.html',
    link: function (scope) {
      scope.getValue = function (item) {
        for (var i = 0, x = scope.field.values.length; i < x; i += 1) {
          if (scope.field.values[i].value === item) {
            return scope.field.values[i].label;
          }
        }
      };
    }
  };
});

angular.module('carnival.components.showFile', [])
.directive('carnivalShowFile', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/file/file.html',
    controller: ["$scope", "$http", "Configuration", function ($scope, $http, Configuration) {
      $scope.checkIfIsImage = function (file) {
        return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file);
      };
    }]
  };
});

angular.module('carnival.components.showHasMany', [])
.directive('carnivalShowHasMany', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/show-fields/has-many/has-many.html'
  };
});

angular.module('carnival.components.show-fields', [])
.directive('carnivalShowFields', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'components/show-fields/show-fields.html'
  };
});

angular.module('carnival.components.showString', [])
.directive('carnivalShowString', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/string/string.html'
  };
});

angular.module('carnival.components.showWysiwyg', [])
.directive('carnivalShowWysiwyg', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '='
    },
    templateUrl: 'components/show-fields/wysiwyg/wysiwyg.html'
  };
});

angular.module('carnival.components.summarized-items', [])
.directive('carnivalSummarizedItems', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      parentEntity: '=',
      field: '=',
      datas: '=',
      state: '@',
      editable: '='
    },
    templateUrl: 'components/summarized-items/summarized-items.html',
    controller: ["$rootScope", "$scope", "$compile", "utils", "$element", "FormService", "Configuration", "EntityResources", function ($rootScope, $scope, $compile, utils, $element, FormService, Configuration, EntityResources) {
      $scope.openItems = function(){
        var nestedEntity = EntityResources.prepareForListState($scope.field.name, $scope.parentEntity);
        var listScope = $scope.$new();
        listScope.entity = nestedEntity;
        FormService.openColumnListing('list', '#form-columns', listScope);
      };
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
    controller: ["$scope", "$http", "Uploader", "Notification", "Configuration", "$filter", function ($scope, $http, Uploader, Notification, Configuration, $filter) {

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
          var message = $filter('translate')('UPLOADED_SUCCESS_MESSAGE');
          new Notification(message, 'warning');
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

angular.module('carnival')
.provider('Configuration', ["$stateProvider", function ($stateProvider) {

  var appName = null;
  var baseApiUrl = null;
  var validateEntities = false;
  var entities = [];
  var navbar = [];
  var extraStates = [];
  var initialPage = {};

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

    addState: function (state){
      extraStates.push(state);
    },

    initialPage: function (options) {
      initialPage = options;
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

        addExtraStates: function (){
          for (var i = 0; i < extraStates.length; i++){
            var state = extraStates[i];
            $stateProvider.state('main.'+state.name, {
              url: state.url,
              templateUrl: state.templateUrl,
              controller: state.controller
            });
          }
        },

        getNavbarItems: function () {
          return navbar;
        },

        getInitialPage: function () {
          return initialPage;
        }

      };
    }

  };

}]);

angular.module('carnival')
.constant('translation', {
  'CREATE_STATE_TITLE': 'Create',
  'EDIT_STATE_TITLE': 'Edit',
  'LIST_STATE_TITLE': 'List',
  'SHOW_STATE_TITLE': 'Show',
  'LIST_STATE_BUTTON_CREATE': 'Create',
  'DELETE_BUTTON_DELETE': 'Delete',
  'DELETE_BUTTON_CANCEL': 'Cancel',
  'DELETE_BUTTON_CONFIRM': 'Confirm',
  'FORM_BUTTON_SAVE': 'Save',
  'GALLERY_BUTTON_OPEN': 'Open Gallery',
  'LISTING_ACTIONS': 'Actions',
  'LISTING_EXTRA_ACTIONS': 'Extra Actions',
  'LISTING_BUTTON_SHOW': 'Show',
  'LISTING_BUTTON_EDIT': 'Edit',
  'LISTING_HAS_MANY_PREFIX': 'View',
  'NESTED_FORM_BUTTON_CREATE': 'Create',
  'NESTED_FORM_TITLE_CREATE': 'Create',
  'SEARCH_FORM_TITLE': 'Search',
  'ARE_YOU_SURE': 'Are you Sure',
  'SEARCH_FORM_SUBMIT': 'Submit',
  'UPLOAD_BUTTON': 'Upload',
  'FORM_BUTTON_EDIT': 'Edit'
});

angular.module('carnival')
.factory('Entity', ["EntityValidation", "$http", "Configuration", "RequestBuilder", "FieldBuilder", function (EntityValidation, $http, Configuration, RequestBuilder, FieldBuilder) {

  var buildFields = function (fields, that) {
    var _fields = [];

    Object.keys(fields).forEach(function (field_name) {
      var field = FieldBuilder.build(field_name, fields[field_name]);
      _fields.push(field);
    });

    that.fields = _fields;
  };

  var buildExtraActions = function (extraActions, that){
    that.extraActions = [];
    if(!extraActions)
      return;

    for(var actionName in extraActions){
      var action = {
        name: actionName,
        url: extraActions[actionName].url,
        action: extraActions[actionName].action,
        label: extraActions[actionName].label
      };

      that.extraActions.push(action);
    }
  };

  function Entity (name, options) {
    if (Configuration.validateEntities) EntityValidation(name, options); // TODO DSL VALIDATION
    this.name = name;
    this.endpoint       = options.endpoint || this.name;
    this.label          = options.label || this.name;
    this.identifier     = options.identifier;
    this.extraReqParams = options.extraReqParams || {};
    this.quickFilters   = options.quickFilters   || null;
    this.pagination     = options.pagination     || null;
    this.defaultSort    = options.defaultSort    || null;
    this.fields = [];
    buildFields(options.fields, this);
    buildExtraActions(options.extraActions, this);
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
.service('ActionFactory', ["Notification", "$state", "ParametersParser", "EntityUpdater", "$filter", function (Notification, $state, ParametersParser, EntityUpdater, $filter) {

  this.buildCreateFunction = function(entity, hasNestedForm, isToNestedForm){
    return function (callback) {
      entity.model.create(ParametersParser.parse(entity.datas, entity))
      .success(function (data, status) {
        if(callback)
          callback(false, data);
        else
          $state.go('main.list', { entity: entity.model.name });
      })
      .error(function (data) {
        if(callback)
          callback(true, data);
      });
    };
  };

  this.buildEditFunction = function(entity){
    return function (callback) {
      entity.model.update(entity.id, ParametersParser.parse(entity.datas, entity))
      .success(function () {
        if(callback){
          callback(false, entity.datas);
        }else{
          $state.go('main.show', { entity: entity.model.name, id: entity.id });
        }
      })
      .error(function (data) {
        callback(true, data);
      });
    };
  };

  this.buildShowFunction = function(entity){
    return function () {
      $state.go('main.edit', { entity: entity.model.name, id: entity.id });
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
        var message = $filter('translate')('DELETED_SUCCESS_MESSAGE');
        new Notification(message, 'warning');
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
      var view_options = views[view_name];
      _views[view_name] = {
        enable:    view_options.enable,
        searchable: typeof view_options.searchable === 'boolean' ? view_options.searchable : true,
        showOptions: view_options.showOptions || false,
        enableDelete: view_options.enableDelete || false,
        nested: view_options.nested || false,
        showAs: view_options.showAs,
        sortable: typeof view_options.sortable === 'boolean' ? view_options.sortable : true
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

  var parseGrid = function (grid) {
    var rowSplitted = grid.split(' ');
    var newRow = rowSplitted[0] === 'row' ? true : false;
    if (rowSplitted[0] === 'row') rowSplitted.splice(0, 1);
    var columnSplitted = rowSplitted[0].split('-');
    var columnSize = columnSplitted[0] === 'column' ? columnSplitted[1] : '12';
    return {
      newRow: newRow,
      columnSize: columnSize
    };
  };
  var hasNested = function(field, viewName){
    if(!field.views) return false;
    if(!field.views[viewName]) return false;
    if(!field.views[viewName].nested) return false;
    return true;
  };

  var resolveFieldFormType = function(field){
    if(field.type === 'hasMany')
      return 'related';

    return 'simple';
  };

  this.build = function(field_name, fieldParams){
    var field = {
      name:       field_name,
      label:      fieldParams.label || field_name,
      foreignKey: fieldParams.foreignKey,
      endpoint:   fieldParams.endpoint || field_name,
      field:      fieldParams.field,
      identifier: fieldParams.identifier || 'id',
      entityName: fieldParams.entityName || field_name,
      type:       fieldParams.type,
      uploader:   fieldParams.uploader,
      gallery:    fieldParams.gallery,
      showAs:    fieldParams.showAs || 'table',
      values:     fieldParams.values,
      grid:       parseGrid(fieldParams.grid || 'row column-12'),
      options:    fieldParams.options,
      views:      buildViews(fieldParams.views)
    };

    field.fieldFormType = resolveFieldFormType(field);
    field.foreignKey = resolveForeignKey(field);

    return field;
  };
});

angular.module('carnival')
.service('EntityResources', ["Configuration", "ActionFactory", function (Configuration, ActionFactory) {
  var self = this;
  var getNestedForm = function(entity, stateName, field){
    if(!field.views[stateName] || !field.views[stateName].nested)
       return;

    entity.nestedForms[field.endpoint] = prepareEntityForState(field.endpoint, 'create', entity);
    entity.nestedForms[field.endpoint].parentEntity = entity;
  };

  var getRelatedResources = function(entity, endpoint){
    var relatedField = Configuration.getEntity(endpoint);
    var order, orderDir = null;
    if (relatedField.defaultSort) {
      order = relatedField.defaultSort.field;
      orderDir = relatedField.defaultSort.dir;
    }
    relatedField.getList(null, null, order, orderDir).success(
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

  var checkIfFieldAreParent = function(parentEntity, field){
    if(!parentEntity)
      return false;

    if(field.entityName === parentEntity.name)
        return true;

    return checkIfFieldAreParent(parentEntity.parentEntity, field);
  };

  var prepareField = function(entityWrapper, stateName, field, parentEntity){
    if (!entityWrapper.model.checkFieldView(field.name, stateName))
      return;

    if(field.entityName && field.entityName === self.entityName){
      return;
    }

    if(checkIfFieldAreParent(parentEntity, field)){
      return;
    }

    entityWrapper.fields.unshift(field);
    if(!hasRelatedResources(stateName, field.type))
      return;

    getRelatedResources(entityWrapper, field.endpoint);
    getNestedForm(entityWrapper, stateName, field);
  };

  var prepareFields = function(entityWrapper, stateName, parentEntity){
    entityWrapper.relatedResources = {};
    for (var i = entityWrapper.model.fields.length - 1; i >= 0; i -= 1) {
      var field = entityWrapper.model.fields[i];
      prepareField(entityWrapper, stateName, field, parentEntity);
    }
  };

  var prepareActions = function(entityWrapper, stateName, isField){
    var actionObj =  ActionFactory.buildAction(entityWrapper, stateName, isField);
    entityWrapper[actionObj.name] = actionObj.value;
  };

  var prepareEntityForState = function(entityName, stateName, parentEntity){
    var entityWrapper = {};
    entityWrapper.nestedForms = {};
    entityWrapper.parentEntity = parentEntity;
    entityWrapper.model = Configuration.getEntity(entityName);
    entityWrapper.name = entityWrapper.model.name;
    entityWrapper.label = entityWrapper.model.label;
    entityWrapper.identifier = entityWrapper.model.identifier;
    entityWrapper.fields = [];
    entityWrapper.extraActions = entityWrapper.model.extraActions;
    entityWrapper.defaultSort  = entityWrapper.model.defaultSort;
    entityWrapper.datas = {};
    prepareFields(entityWrapper, stateName, parentEntity);
    prepareActions(entityWrapper, stateName, parentEntity);
    return entityWrapper;
  };

  this.prepareForState = function(entityName, stateName, parentEntity){
    this.entityName = entityName;
    return prepareEntityForState(entityName, stateName, parentEntity);
  };

  this.prepareForCreateState = function(entityName, parentEntity){
    return this.prepareForState(entityName, 'create', parentEntity);
  };

  this.prepareForEditState = function(entityName, parentEntity){
    return this.prepareForState(entityName, 'edit', parentEntity);
  };

  this.prepareForShowState = function(entityName){
    return this.prepareForState(entityName, 'show');
  };

  this.prepareForListState = function(entityName, parentEntity){
    return this.prepareForState(entityName, 'index', parentEntity);
  };
}]);

angular.module('carnival')
.service('EntityUpdater', function () {

  var isEditData = function(entity, fieldToUpdate, fieldData){
    var entityDatas = entity.datas[fieldToUpdate.name];
    for(var i = 0; i < entityDatas.length; i++){
      var data = entityDatas[i];
      if(data[fieldToUpdate.identifier] === fieldData[fieldToUpdate.identifier])
        return true;
    }
    return false;
  };

  var updateData = function(entity, fieldToUpdate, fieldData){
    updateList(entity, fieldToUpdate, fieldData, entity.datas[fieldToUpdate.name]);
  };

  var updateResources = function(entity, fieldToUpdate, fieldData){
    updateList(entity, fieldToUpdate, fieldData, entity.relatedResources[fieldToUpdate.endpoint]);
  };

  var updateList = function(entity, fieldToUpdate, fieldData, listToUpdated){
    for(var i = 0; i < listToUpdated.length; i++){
      var data = listToUpdated[i];
      if(data[fieldToUpdate.identifier] === fieldData[fieldToUpdate.identifier])
      {
        for(var key in data)
          data[key] = fieldData[key];
        break;
      }
    }
  };

  var addOrUpdateData = function(entity, fieldToUpdate, fieldData){
    var entityDatas = entity.datas[fieldToUpdate.name];
    if(isEditData(entity, fieldToUpdate, fieldData)){
      updateData(entity, fieldToUpdate, fieldData);
      updateResources(entity, fieldToUpdate, fieldData);
    }else{
      entityDatas.push(fieldData);
      entity.relatedResources[fieldToUpdate.endpoint].push(fieldData);
    }
  };

  this.updateEntity = function(entity, fieldToUpdate, fieldData){

    if(fieldToUpdate.type === 'belongsTo'){
      entity.datas[fieldToUpdate.name] = fieldData;
      entity.relatedResources[fieldToUpdate.endpoint].push(fieldData);
    }else if(fieldToUpdate.type === 'hasMany'){
      if(!entity.datas[fieldToUpdate.name])
        entity.datas[fieldToUpdate.name] = [];

      addOrUpdateData(entity, fieldToUpdate, fieldData);
    }
  };
});

angular.module('carnival')
.service('FormService', ["Configuration", "ActionFactory", "$document", "$compile", "$timeout", "$state", function (Configuration, ActionFactory, $document, $compile, $timeout, $state) {
  this.nesteds = {};
  this.init = function(entity){
    this.entity = entity;
    this.nesteds = {};
    this.columns = {};
  };

  this.columnsCount = function(){
    return Object.keys(this.columns).length;
  };

  this._addNested = function(containerId, scope, directive){
    var newElement = $compile(directive)(scope);
    var nestedDiv = document.querySelector(containerId);
    angular.element(nestedDiv).append(newElement);
  };

  this._addColumn = function(directive, formId, containerId, scope){
    if(!this.columns[formId])
        this.columns[formId] = {};
    var self = this;
    self._addNested(containerId, scope, directive);
  };

  this.goToNextStep = function(entityName, type){
    if(type === 'column')
      this.closeColumn('form' + '-' + entityName);
    else if(type === 'nested')
      this.closeNested(entityName);
    else
      $state.go('main.list', { entity: entityName});
  };

  this.openColumn = function(state, containerId, scope){
    var formId = 'form-' + scope.entity.name;
    var index = this.columnsCount() || 0;
    var directive = '<carnival-form-column index="'+index+'" type="form" entity="entity" state="'+state+'"></carnival-form-column>';
    this._addColumn(directive, formId, containerId, scope);
  };

  this.openColumnListing = function(state, containerId, scope){
    var formId = 'table-' + scope.entity.name;
    var index = this.columnsCount() || 0;
    var directive = '<carnival-form-column index="'+index+'" type="table" field="field" entity="entity" datas="datas"></carnival-form-column>';
    this._addColumn(directive, formId, containerId, scope);
  };

  this.openNested = function(state, containerId, scope){
    if(this.isNestedOpen(scope.entity.name)){
      var self = this;
      this.closeNested(scope.entity.name);
      $timeout(function(){
        self.openNested(state, containerId, scope);
      }, 200);
      return;
    }
    if(!this.nesteds[scope.entity.name])
        this.nesteds[scope.entity.name] = {};

    var nestedForms = this.nesteds[scope.entity.name];
    var directive = '<carnival-nested-form state="'+state+'" type="nested" entity="entity"></carnival-nested-form></div>';
    this._addNested(containerId, scope, directive);
  };

  this.isNestedOpen = function(formId){
    if(!this.nesteds[formId])
      return false;
    return true;
  };

  this.closeColumn = function(formId){
    delete this.columns[formId];
  };

  this.closeNested = function(formId){
    delete this.nesteds[formId];
  };
}]);


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
.factory('notificationFactory', function () {
  var notifications = [];
  return notifications;
});

angular.module('carnival')
.service('Notification', ["$timeout", "notificationFactory", function ($timeout, notificationFactory) {

  var notificationKiller = function () {
    notificationFactory.splice(notificationFactory.length - 1, 1);
  };

  function Notification (message, type, opts) {
    if(!opts)
      opts = {};
    this.message = message;
    this.type = type;
    var timeout = opts.timeout || 3000;
    var callback = opts.callback;
    notificationFactory.unshift(this);
    $timeout(function(){
      notificationKiller();
      if(callback)
        callback();
    }, timeout);
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
    if(params.offset)
      request.params.offset = params.offset;
    if(params.limit)
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
.constant('defaultTranslations', {
  'YES': 'Yes',
  'NO': 'No',
  'CREATE_STATE_TITLE': 'Create',
  'EDIT_STATE_TITLE': 'Edit',
  'LIST_STATE_TITLE': 'List',
  'ARE_YOU_SURE': 'Are you Sure?',
  'ARE_YOU_SURE_DELETE': 'Are you sure you want to delete?',
  'SHOW_STATE_TITLE': 'Show',
  'LIST_STATE_BUTTON_CREATE': 'Create',
  'DELETE_BUTTON_DELETE': 'Delete',
  'DELETE_BUTTON_CANCEL': 'Cancel',
  'DELETE_BUTTON_CONFIRM': 'Confirm',
  'FORM_BUTTON_SAVE': 'Save',
  'GALLERY_BUTTON_OPEN': 'Open Gallery',
  'LISTING_ACTIONS': 'Actions',
  'LISTING_EXTRA_ACTIONS': 'Extra Actions',
  'LISTING_BUTTON_SHOW': 'Show',
  'LISTING_BUTTON_EDIT': 'Edit',
  'LISTING_HAS_MANY_PREFIX': 'View',
  'NESTED_FORM_BUTTON_CREATE': 'Create',
  'NESTED_FORM_TITLE_CREATE': 'Create',
  'SEARCH_FORM_TITLE': 'Search',
  'SEARCH_FORM_SUBMIT': 'Submit',
  'UPLOAD_BUTTON': 'Upload',
  'CREATED_SUCCESS_MESSAGE': 'Item created with success!',
  'DELETED_SUCCESS_MESSAGE': 'Item deleted with success!',
  'UPDATED_SUCCESS_MESSAGE': 'Item updated with success!',
  'UPLOADED_SUCCESS_MESSAGE': 'Item uploaded with success!',
  'CREATE_RELATIONS_MESSAGE': ' created. Now you can create the relation(s)'

});

angular.module('carnival')
.filter('translate', ["Translation", function (Translation) {
  return function (value) {
    if (Translation.table && Translation.table[value]) {
      return Translation.table[value];
    }
    return Translation.defaults[value] || value;
  };
}]);

angular.module('carnival')
.provider('Translation', ["defaultTranslations", function (defaultTranslations) {
  
  var defaults = defaultTranslations; 
  var translationTable; 

  return {

    setTranslation: function (table) {
      translationTable = table;
    },

    $get: function () {
      return {
        defaults: defaults,
        table: translationTable 
      };
    }

  };

}]);

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
    if (value instanceof Date) value = value.toISOString();
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
    if (typeof str !== 'string') return str;
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
    });
  };

  $scope.show = function(){
    return document.getElementsByClassName('form-column').length > 1;

  };
  var getZIndex = function(){
      return ((document.getElementsByClassName('form-column').length - 1) * 10) + 3;
  };

  var getHeight = function(){
    return (document.querySelector('#master-form').offsetHeight);
  };

  $scope.getStyle = function(){
    return {
      zIndex:  getZIndex(),
      height: getHeight() + 'px'
    };
  };


  init();

}]);

angular.module('carnival')
.controller('ListController', ["$rootScope", "$scope", "$stateParams", "$state", "Configuration", "Notification", "urlParams", "EntityResources", "$filter", function ($rootScope, $scope, $stateParams, $state, Configuration, Notification, urlParams, EntityResources, $filter) {

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

}]);

angular.module('carnival')
.controller('ShowController', ["$scope", "$stateParams", "$state", "Configuration", "EntityResources", function ($scope, $stateParams, $state, Configuration, EntityResources) {

  var entity = $scope.entity = {};

  $scope.buttonAction = function(){
    $state.go('main.edit', { entity: entity.name, id: entity.datas.id });
  };

  $scope.getValue = function (item, field) {
    for (var i = 0, x = field.values.length; i < x; i += 1) {
      if (field.values[i].value === item) {
        return field.values[i].label;
      }
    }
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
.controller('MainController', ["$scope", "$state", "$rootScope", "Configuration", function ($scope, $state, $rootScope, Configuration) {

  var app_name = $scope.app_name = Configuration.getAppName(),
      menu_items = $scope.menu_items = Configuration.getNavbarItems();

  var getFirstEntityItemOnMenu = function () {
    for (var i = 0, x = menu_items.length; i < x; i += 1) {
      if (menu_items[i].link.type === 'entity') {
        return menu_items[i];
      }
    }
    return false;
  };

  var checkInitialPage = function () {
    var initialPage = Configuration.getInitialPage();
    if (!initialPage || Object.keys(initialPage).length <= 0) {
      initialPage = {
        type: getFirstEntityItemOnMenu().link.type,
        entity: getFirstEntityItemOnMenu().link.url
      };
    }
    if (!initialPage) {
      return;
    }
    if (initialPage.type === 'entity') {
      $state.go('main.list', { entity: initialPage.entity });
      return;
    }
    if (initialPage.type === 'state') {
      $state.go('main.' + initialPage.state.name, initialPage.state.options);
      return;
    }
  };

  $rootScope.$on('$stateChangeSuccess', function () {
    if ($state.current.name === 'main') {
      checkInitialPage();
    }
  });

  $rootScope.$broadcast('$stateChangeSuccess');

}]);

angular.module('carnival.templates', ['components/button/button.html', 'components/column-form/column-form.html', 'components/column-listing/column-listing.html', 'components/delete-button/delete-button.html', 'components/field-form-builder/field-form-builder.html', 'components/fields/belongs-to/belongs-to.html', 'components/fields/boolean/boolean.html', 'components/fields/currency/currency.html', 'components/fields/date/date.html', 'components/fields/enum/enum.html', 'components/fields/file/file.html', 'components/fields/has-many/has-many.html', 'components/fields/number/number.html', 'components/fields/select/select.html', 'components/fields/string/string.html', 'components/fields/text/text.html', 'components/fields/wysiwyg/wysiwyg.html', 'components/form-area/form-area.html', 'components/form-column/form-column.html', 'components/form-fields-next/form-fields-next.html', 'components/form-fields/form-fields.html', 'components/form/form.html', 'components/gallery/gallery.html', 'components/has-many-select/has-many-select.html', 'components/has-many-table/has-many-table.html', 'components/listing-extra-action/listing-extra-action.html', 'components/listing-field-belongs-to/listing-field-belongs-to.html', 'components/listing-field-boolean/listing-field-boolean.html', 'components/listing-field-currency/listing-field-currency.html', 'components/listing-field-date/listing-field-date.html', 'components/listing-field-enum/listing-field-enum.html', 'components/listing-field-file/listing-field-file.html', 'components/listing-field-has-many/listing-field-has-many.html', 'components/listing-field/listing-field.html', 'components/listing/listing.html', 'components/navbar/navbar.html', 'components/nested-form/nested-form.html', 'components/notification/notification.html', 'components/order-controller/order-controller.html', 'components/pagination-controller/pagination-controller.html', 'components/quickfilter-controller/quickfilter-controller.html', 'components/search-controller/search-controller.html', 'components/show-fields/boolean/boolean.html', 'components/show-fields/currency/currency.html', 'components/show-fields/date/date.html', 'components/show-fields/enum/enum.html', 'components/show-fields/file/file.html', 'components/show-fields/has-many/has-many.html', 'components/show-fields/show-fields.html', 'components/show-fields/string/string.html', 'components/show-fields/wysiwyg/wysiwyg.html', 'components/summarized-items/summarized-items.html', 'components/uploader/uploader.html', 'states/main.create/create.html', 'states/main.edit/edit.html', 'states/main.list/list.html', 'states/main.show/show.html', 'states/main/main.html']);

angular.module("components/button/button.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/button/button.html",
    "<a class=\"button {{ style }} {{ size }}\">{{ label }}</a>\n" +
    "");
}]);

angular.module("components/column-form/column-form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/column-form/column-form.html",
    "<div>\n" +
    "  <div class='column small-12'>\n" +
    "    <h3>{{ 'EDIT_STATE_TITLE' | translate }} {{ entity.label }}</h3>\n" +
    "  </div>\n" +
    "  <carnival-form type='column' entity=\"entity\" fields=\"entity.fields\" datas=\"entity.datas\" action=\"entity.action\" state=\"{{state}}\" related-resources=\"entity.relatedResources\" editable=\"true\"></carnival-form>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/column-listing/column-listing.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/column-listing/column-listing.html",
    "<div class=\"listing\">\n" +
    "  <carnival-field-form-builder state='create' parent-entity='entity.parentEntity' field='field'></carnival-field-form-builder>\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th ng-repeat=\"field in getListFields()\">\n" +
    "          {{ field.label }}\n" +
    "        </th>\n" +
    "        <th>\n" +
    "        </th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"data in datas\">\n" +
    "        <td ng-repeat=\"field in getListFields()\">\n" +
    "          <carnival-listing-field item=\"data\" field=\"field\"></carnival-listing-field>\n" +
    "        </td>\n" +
    "        <td>\n" +
    "          <carnival-field-form-builder data=\"data\" state='edit' parent-entity='entity.parentEntity' field='field'></carnival-field-form-builder>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/delete-button/delete-button.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/delete-button/delete-button.html",
    "<span class=\"btn-delete\">\n" +
    "  <a  class=\"button alert tiny\" ng-click=\"delete()\">{{ 'DELETE_BUTTON_DELETE' | translate }}</a>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/field-form-builder/field-form-builder.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/field-form-builder/field-form-builder.html",
    "<div ng-switch='state'>\n" +
    "  <div ng-switch-when='create' id=\"create_nested_{{field.entityName}}\"></div>\n" +
    "  <a ng-switch-when='create' class=\"button default tiny form-builder\" ng-click=\"open()\">{{ 'NESTED_FORM_BUTTON_CREATE' | translate }}</a>\n" +
    "\n" +
    "  <a ng-switch-when='edit' id='editHasManyOption' ng-click='openWithData();' class=\"button warning tiny form-builder\">{{getButtonLabel()}}</a>\n" +
    "  <carnival-delete-button ng-switch-when=\"delete\" action=\"delete\" item-id=\"data[field.identifier]\"></carnival-delete-button>\n" +
    "  <div ng-switch-when='edit' id=\"edit_nested_{{field.name}}_{{data[field.identifier]}}\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/belongs-to/belongs-to.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/belongs-to/belongs-to.html",
    "<div>\n" +
    "  <carnival-select-field data=\"datas\" field=\"field.field\" identifier=\"field.identifier\" items=\"relatedResources\">\n" +
    "  </carnival-select-field>\n" +
    "  <carnival-field-form-builder ng-if='hasNested()' state='create' parent-entity='parentEntity' field='field'></carnival-field-form-builder>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/boolean/boolean.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/boolean/boolean.html",
    "<input type=\"checkbox\" ng-model=\"data\"></input>\n" +
    "");
}]);

angular.module("components/fields/currency/currency.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/currency/currency.html",
    "<div>\n" +
    "  <input class=\"form-control\" type=\"text\" ng-model=\"data\" currency></input>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/date/date.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/date/date.html",
    "<div>\n" +
    "  <input type=\"datetime\" date-time ng-model=\"$parent.data\">\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/enum/enum.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/enum/enum.html",
    "<div>\n" +
    "  <carnival-select-field data=\"data\" field=\"'label'\" identifier=\"'value'\" items=\"field.values\" editable=\"true\"></carnival-select-field>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/file/file.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/file/file.html",
    "<div>\n" +
    "  <div ng-show=\"field.options.showPreview\">\n" +
    "    <img ng-if=\"checkIfIsImage(data)\" ng-src=\"{{ data }}\" width=\"200\" height=\"120\"/>\n" +
    "    <a ng-if=\"!checkIfIsImage(data)\" href=\"{{ data }}\">{{ data }}</a>\n" +
    "  </div>\n" +
    "  <carnival-string-field label=\"field.label\" data=\"data\" editable=\"editable\"></carnival-string-field>\n" +
    "  <div ng-if=\"checkIfHasUploader()\">\n" +
    "    <carnival-uploader uploader=\"field.uploader\" file-url=\"$parent.data\"></carnival-uploader>\n" +
    "  </div>\n" +
    "  <div ng-if=\"checkIfHasGallery()\">\n" +
    "    <carnival-gallery gallery=\"field.gallery\" file-url=\"$parent.data\"></carnival-gallery>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/fields/has-many/has-many.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/fields/has-many/has-many.html",
    "<div>\n" +
    "\n" +
    "  <div ng-switch='showAs()'>\n" +
    "    <carnival-has-many-table ng-switch-when='table' has-nested='hasNested()'  parent-entity='parentEntity' field='field' datas='datas' state='state' editable='editable'></carnival-has-many-table>\n" +
    "    <ul class='carnival-tags' ng-switch-when='tag' class='has-many-field-list'>\n" +
    "      <li class='carnival-tag' ng-repeat='data in datas'>\n" +
    "        <carnival-field-form-builder ng-if='hasNested()' label='{{data[field.field]}}' data=\"data\" state='edit' parent-entity='parentEntity' field='field'></carnival-field-form-builder>\n" +
    "        <a id='removeHasManyOption' ng-click='remove(data.id);' class=\"button default tiny remove-tag\">x</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "  <div>\n" +
    "    <carnival-has-many-select ng-show='showOptions()' field='field' related-resources='relatedResources' datas='datas'></carnival-has-many-select>\n" +
    "    <carnival-field-form-builder ng-if='hasNested()' state='create' parent-entity='parentEntity' field='field' datas='datas'></carnival-field-form-builder>\n" +
    "  </div>\n" +
    "\n" +
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
    "<div>\n" +
    "<select ng-model=\"data\" ng-options=\"item[identifier] as item[field] for item in items\">\n" +
    "</select>\n" +
    "</div>\n" +
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
    "  <textarea ng-wig=\"data\"></textarea>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/form-area/form-area.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/form-area/form-area.html",
    "<div id='form-columns'>\n" +
    "  <div id='master-form' class='form-column {{getDisableClass()}}'>\n" +
    "    <div class='column small-12'>\n" +
    "      <h3 ng-if=\"state == 'edit' \">{{ 'EDIT_STATE_TITLE' | translate }} {{ entity.label }}</h3>\n" +
    "      <h3 ng-if=\"state == 'create' \">{{ 'CREATE_STATE_TITLE' | translate }} {{ entity.label }}</h3>\n" +
    "    </div>\n" +
    "    <carnival-form type='normal' entity=\"entity\" fields=\"fields\" datas=\"datas\" action=\"entity.action\" state=\"{{state}}\" related-resources=\"relatedResources\" editable=\"true\"></carnival-form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/form-column/form-column.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/form-column/form-column.html",
    "<div ng-switch='type' ng-style=\"style\" class='children-form form-column {{cssClass}} {{getDisableClass()}}'>\n" +
    "  <div class='disable-column-form'>\n" +
    "  </div>\n" +
    "  <span class='button' ng-click='close()'>Close</span>\n" +
    "  <carnival-column-form ng-switch-when='form' entity=\"entity\" state=\"{{state}}\"></carnival-column-form>\n" +
    "  <carnival-column-listing ng-switch-when='table' entity=\"entity\" field=\"field\" datas=\"datas\"></carnival-column-listing>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/form-fields-next/form-fields-next.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/form-fields-next/form-fields-next.html",
    "<div>\n" +
    "<label class='carnival-form-label'>\n" +
    "    {{ fields[$index + 1].label }}\n" +
    "  </label>\n" +
    "  <div ng-switch=\"fields[$index + 1].type\" class='carnival-form-field'>\n" +
    "    <carnival-text-field ng-switch-when=\"text\" data=\"datas[fields[$index + 1].name]\" label=\"fields[$index + 1].label\"></carnival-text-field>\n" +
    "    <carnival-wysiwyg-field ng-switch-when=\"wysiwyg\" data=\"datas[fields[$index + 1].name]\" label=\"fields[$index + 1].label\"></carnival-wysiwyg-field>\n" +
    "    <carnival-boolean-field ng-switch-when=\"boolean\" data=\"datas[fields[$index + 1].name]\"></carnival-boolean-field>\n" +
    "    <carnival-string-field ng-switch-when=\"string\" data=\"datas[fields[$index + 1].name]\" label=\"fields[$index + 1].label\"></carnival-string-field>\n" +
    "    <carnival-number-field ng-switch-when=\"number\" data=\"datas[fields[$index + 1].name]\" label=\"fields[$index + 1].label\"></carnival-number-field>\n" +
    "    <carnival-date-field ng-switch-when=\"date\" data=\"datas[fields[$index + 1].name]\"></carnival-date-field>\n" +
    "    <carnival-file-field ng-switch-when=\"file\" data=\"datas[fields[$index + 1].name]\" field=\"fields[$index + 1]\"></carnival-file-field>\n" +
    "    <carnival-enum-field ng-switch-when=\"enum\" data=\"datas[fields[$index + 1].name]\" field=\"fields[$index + 1]\"></carnival-enum-field>\n" +
    "    <carnival-currency-field ng-switch-when=\"currency\" data=\"datas[fields[$index + 1].name]\" field=\"fields[$index + 1]\"></carnival-currency-field>\n" +
    "    <carnival-belongs-to-field ng-if='canShow(fields[$index + 1])' ng-switch-when=\"belongsTo\" nested-form-index=\"nestedFormIndex\" entity=\"entity\" field=\"fields[$index + 1]\" datas=\"entity.datas\" action=\"entity.action\" related-resources=\"entity.relatedResources\" state=\"{{state}}\"></carnival-belongs-to-field>\n" +
    "    <carnival-has-many-field ng-if='canShow(fields[$index + 1])' ng-switch-when=\"hasMany\" entity=\"entity\" nested-form-index=\"nestedFormIndex\" field=\"fields[$index + 1]\" datas=\"entity.datas\" action=\"entity.action\" related-resources=\"entity.relatedResources\" state=\"{{state}}\"></carnival-has-many-field>\n" +
    "    <carnival-text-field ng-switch-default data=\"datas[fields[$index + 1].name]\" label=\"fields[$index + 1].label\"></carnival-text-field>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("components/form-fields/form-fields.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/form-fields/form-fields.html",
    "<div>\n" +
    "  <label class='carnival-form-label'>\n" +
    "    {{ field.label }}\n" +
    "  </label>\n" +
    "  <div ng-switch=\"field.type\" class='carnival-form-field'>\n" +
    "    <carnival-text-field ng-switch-when=\"text\" data=\"datas[field.name]\" label=\"field.label\"></carnival-text-field>\n" +
    "    <carnival-wysiwyg-field ng-switch-when=\"wysiwyg\" data=\"datas[field.name]\" label=\"field.label\"></carnival-wysiwyg-field>\n" +
    "    <carnival-boolean-field ng-switch-when=\"boolean\" data=\"datas[field.name]\"></carnival-boolean-field>\n" +
    "    <carnival-string-field ng-switch-when=\"string\" data=\"datas[field.name]\" label=\"field.label\"></carnival-string-field>\n" +
    "    <carnival-number-field ng-switch-when=\"number\" data=\"datas[field.name]\" label=\"field.label\"></carnival-number-field>\n" +
    "    <carnival-date-field ng-switch-when=\"date\" data=\"datas[field.name]\"></carnival-date-field>\n" +
    "    <carnival-file-field ng-switch-when=\"file\" data=\"datas[field.name]\" field=\"field\"></carnival-file-field>\n" +
    "    <carnival-enum-field ng-switch-when=\"enum\" data=\"datas[field.name]\" field=\"field\"></carnival-enum-field>\n" +
    "    <carnival-currency-field ng-switch-when=\"currency\" data=\"datas[field.name]\" field=\"field\"></carnival-currency-field>\n" +
    "    <carnival-belongs-to-field ng-switch-when=\"belongsTo\" parent-entity=\"entity\" field=\"field\" datas=\"entity.datas[field.foreignKey]\" action=\"entity.action\" related-resources=\"entity.relatedResources[field.endpoint]\" state=\"{{state}}\"></carnival-belongs-to-field>\n" +
    "    <carnival-text-field ng-switch-default data=\"datas[field.name]\" label=\"field.label\"></carnival-text-field>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("components/form/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/form/form.html",
    "<div>\n" +
    "\n" +
    "  <form ng-init=\"nestedFormIndex = {value: 0}\" novalidate>\n" +
    "    <div ng-if=\"field.fieldFormType != 'related'\" ng-repeat=\"field in fields\" ng-class=\"{ row: field.grid.newRow }\">\n" +
    "      <div>\n" +
    "        <carnival-form-fields class=\"column small-{{ field.grid.columnSize }}\" ng-show=\"field.grid.newRow\"></carnival-form-fields>\n" +
    "        <carnival-form-fields-next class=\"column small-{{ fields[$index + 1].grid.columnSize }}\" ng-show=\"!fields[$index + 1].grid.newRow && $index + 1 !== fields.length\"></carnival-form-fields-next>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class='column small-12' id='related-fields' ng-show='showRelatedFields()'>\n" +
    "      <h4>Relacionamentos</h4>\n" +
    "\n" +
    "      <ul class='tabs'>\n" +
    "        <li ng-if=\"field.fieldFormType == 'related'\" class=\"tab-title {{getTabClass($index)}}\" ng-repeat=\"field in fields\">\n" +
    "          <a ng-init='initSelectedTab($index)' ng-click='selectTab($index)'>\n" +
    "            {{ field.label }}\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      <div ng-if=\"field.fieldFormType == 'related'\" class=\"row\" ng-repeat=\"field in fields\">\n" +
    "        <div class='carnival-tab' ng-show='selectedTab == $index' id=\"panel{{$index}}\" ng-switch=\"field.type\">\n" +
    "          <carnival-belongs-to-field ng-switch-when=\"belongsTo\" parent-entity=\"entity\" field=\"field\" datas=\"entity.datas[field.name]\" action=\"entity.action\" related-resources=\"entity.relatedResources[field.name]\" state=\"{{state}}\"></carnival-belongs-to-field>\n" +
    "          <carnival-has-many-field ng-switch-when=\"hasMany\" parent-entity=\"entity\" field=\"field\" datas=\"entity.datas[field.name]\" action=\"entity.action\" related-resources=\"entity.relatedResources[field.name]\" state=\"{{state}}\"></carnival-has-many-field>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class='column small-12'>\n" +
    "      <carnival-button label=\"{{ 'FORM_BUTTON_SAVE' | translate }}\" style=\"success\" size=\"{{saveButtonClass}}\" ng-click=\"buttonAction()\"></carnival-button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/gallery/gallery.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/gallery/gallery.html",
    "<div>\n" +
    "  <carnival-button label=\"{{ 'GALLERY_BUTTON_OPEN' | translate }}\" style=\"default\" size=\"small\" ng-click=\"open()\"></carnival-button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/has-many-select/has-many-select.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/has-many-select/has-many-select.html",
    "<div class='carnival-has-many-select'>\n" +
    "  <select ng-model=\"selectedHasMany\">\n" +
    "    <option value={{$index}} ng-repeat='item in getAvailableResources()'>\n" +
    "    {{item[field.field]}}\n" +
    "    </option>\n" +
    "  </select>\n" +
    "\n" +
    "  <a class=\"button default tiny\" ng-click=\"addHasManyOption()\">Add</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/has-many-table/has-many-table.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/has-many-table/has-many-table.html",
    "<div class=\"has-many-table\">\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th ng-repeat=\"field in getListFields()\">\n" +
    "          {{ field.label }}\n" +
    "        </th>\n" +
    "        <th>\n" +
    "        </th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"data in datas\">\n" +
    "        <td ng-repeat=\"field in getListFields()\">\n" +
    "          <carnival-listing-field item=\"data\" field=\"field\"></carnival-listing-field>\n" +
    "        </td>\n" +
    "        <td>\n" +
    "          <carnival-field-form-builder ng-if=\"hasNested\" data=\"data\" state='edit' parent-entity='entity.parentEntity' field='field'></carnival-field-form-builder>\n" +
    "          <carnival-field-form-builder ng-if=\"hasNested\" data=\"data\" state='delete' parent-entity='entity.parentEntity' field='field'></carnival-field-form-builder>\n" +
    "          <a ng-if=\"!hasNested\" class='button warning tiny' href=\"#/edit/{{field.name}}/{{data[field.identifier]}}\">Edit</a>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/listing-extra-action/listing-extra-action.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-extra-action/listing-extra-action.html",
    "<span class='carnival-listing-extra-action-{{extraAction.name}}'>\n" +
    "  <a ng-if=\"extraAction.action\" class=\"button default tiny\" ng-click=\"executeAction()\">{{ getLabel() }}</a>\n" +
    "  <a ng-if=\"extraAction.url\" class=\"button default tiny\" ng-href='{{ getUrl() }}'>{{ getLabel() }}</a>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/listing-field-belongs-to/listing-field-belongs-to.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-belongs-to/listing-field-belongs-to.html",
    "<span>\n" +
    "  <a href=\"{{ getUrl() }}\">{{ getLabel() }}</a>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/listing-field-boolean/listing-field-boolean.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-boolean/listing-field-boolean.html",
    "<div>\n" +
    "  <span ng-show=\"item[field.name]\">&#10003;</span>\n" +
    "  <span ng-show=\"!item[field.name]\">&#10007;</span>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/listing-field-currency/listing-field-currency.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-currency/listing-field-currency.html",
    "<div>\n" +
    "  {{ toCurrency(item[field.name]) }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/listing-field-date/listing-field-date.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-date/listing-field-date.html",
    "<div>\n" +
    "  {{ item[field.name] ? toDate(item[field.name]) : '' }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/listing-field-enum/listing-field-enum.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-enum/listing-field-enum.html",
    "<div>\n" +
    "  {{ getValue(item[field.name]) }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/listing-field-file/listing-field-file.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-file/listing-field-file.html",
    "<div>\n" +
    "  <img ng-if=\"checkIfIsImage(item[field.name])\" ng-src=\"{{ item[field.name] }}\" style=\"max-width:200px;max-height:120px\"/>\n" +
    "  <a ng-if=\"!checkIfIsImage(item[field.name])\" href=\"{{ item[field.name] }}\">{{ item[field.name] }}</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/listing-field-has-many/listing-field-has-many.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field-has-many/listing-field-has-many.html",
    "<span>\n" +
    "  <a href=\"{{ getUrl() }}\">{{ 'LISTING_HAS_MANY_PREFIX' | translate }} {{ field.label }}</a>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/listing-field/listing-field.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing-field/listing-field.html",
    "<span ng-switch=\"field.type\">\n" +
    "  <carnival-listing-field-belongs-to ng-switch-when=\"belongsTo\" item=\"item\" field=\"field\"></carnival-listing-field-belongs-to>\n" +
    "  <carnival-listing-field-has-many ng-switch-when=\"hasMany\" item=\"item\" field=\"field\"></carnival-listing-field-has-many>\n" +
    "  <carnival-listing-field-file ng-switch-when=\"file\" item=\"item\" field=\"field\"></carnival-listing-field-file>\n" +
    "  <carnival-listing-field-enum ng-switch-when=\"enum\" item=\"item\" field=\"field\"></carnival-listing-field-enum>\n" +
    "  <carnival-listing-field-currency ng-switch-when=\"currency\" item=\"item\" field=\"field\"></carnival-listing-field-currency>\n" +
    "  <carnival-listing-field-date ng-switch-when=\"date\" item=\"item\" field=\"field\"></carnival-listing-field-date>\n" +
    "  <span ng-switch-default>\n" +
    "    {{item[field.name]}}\n" +
    "  </span>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/listing/listing.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/listing/listing.html",
    "<div class=\"listing\">\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th ng-repeat=\"field in fields\">\n" +
    "          {{ field.label }}\n" +
    "          <carnival-order-ctrl ng-show=\"field.views.index.sortable\" field=\"field.name\"></carnival-order-ctrl>\n" +
    "        </th>\n" +
    "        <th ng-show=\"extraActions[0]\">\n" +
    "          {{ 'LISTING_EXTRA_ACTIONS' | translate }}\n" +
    "        </th>\n" +
    "        <th ng-if=\"actions\">\n" +
    "          {{ 'LISTING_ACTIONS' | translate }}\n" +
    "        </th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"data in datas\">\n" +
    "        <td ng-repeat=\"field in fields\">\n" +
    "          <carnival-listing-field item=\"data\" field=\"field\"></carnival-listing-field>\n" +
    "        </td>\n" +
    "        <td ng-show=\"extraActions[0]\">\n" +
    "          <carnival-listing-extra-action ng-repeat=\"extraAction in extraActions\" item=\"data\" extra-action='extraAction'></carnival-listing-extra-action>\n" +
    "        </td>\n" +
    "        <td>\n" +
    "          <carnival-button label=\"{{ 'LISTING_BUTTON_SHOW' | translate }}\" style=\"primary btn-details\" size=\"tiny\" ng-click=\"actions.show(data[identifier])\"></carnival-button>\n" +
    "          <carnival-button label=\"{{ 'LISTING_BUTTON_EDIT' | translate }}\" style=\"warning btn-edit\" size=\"tiny\" ng-click=\"actions.edit(data[identifier])\"></carnival-button>\n" +
    "          <carnival-delete-button item-id=\"data[identifier]\" action=\"actions.delete\"></carnival-button>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/navbar/navbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/navbar/navbar.html",
    "<nav class=\"top-bar\" data-topbar role='navigation'>\n" +
    "  <ul class='title-area'>\n" +
    "    <li class='name'>\n" +
    "      <h1><a href=\"#\">{{ appName }}</h1>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <section class='top-bar-section'>\n" +
    "    <ul class=\"left\">\n" +
    "      <li ng-class=\"{ active: checkSelEntity($index) }\" ng-repeat=\"item in menuItems\">\n" +
    "      <a href=\"{{ buildUrl(item.link) }}\" ng-click=\"resetPage()\">{{ item.label }}</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "</nav>\n" +
    "");
}]);

angular.module("components/nested-form/nested-form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/nested-form/nested-form.html",
    "<fieldset class=\"nested-container animated fadeIn\">\n" +
    "  <legend>{{ 'NESTED_FORM_TITLE_CREATE' | translate }}</legend>\n" +
    "  <carnival-form type='nested' entity='entity' fields=\"entity.fields\" action=\"entity.action\" datas=\"entity.datas\" state=\"{{state}}\" related-resources=\"entity.relatedResources\" editable=\"true\"></carnival-form>\n" +
    "</fieldset>\n" +
    "");
}]);

angular.module("components/notification/notification.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/notification/notification.html",
    "<div>\n" +
    "  <div ng-repeat=\"notification in notifications\" class=\"alert-box {{ notification.type }} radius\">{{ notification.message }}</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/order-controller/order-controller.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/order-controller/order-controller.html",
    "<a ng-show=\"checkDirAsc()\" style=\"font-size: 0.75em; cursor: pointer\" ng-click=\"toggleOrder()\">&#9650;</a>\n" +
    "<a ng-show=\"!checkDirAsc()\" style=\"font-size: 0.75em; cursor: pointer\" ng-click=\"toggleOrder()\">&#9660;</a>\n" +
    "");
}]);

angular.module("components/pagination-controller/pagination-controller.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/pagination-controller/pagination-controller.html",
    "<nav>\n" +
    "  <ul class=\"pagination\" style=\"cursor: pointer;\">\n" +
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
    "    <li class=\"current\">\n" +
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
    "  <carnival-button ng-class=\"{ disabled: isSelected(filter.field, filter.value()) }\" ng-repeat=\"filter in filters\" label=\"{{ filter.label }}\" style=\"info\" size=\"small\" ng-click=\"setFilter(filter.field, filter.value())\"></carnival-button>\n" +
    "</span>\n" +
    "");
}]);

angular.module("components/search-controller/search-controller.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/search-controller/search-controller.html",
    "<div class=\"advanced-search\">\n" +
    "  <h4>{{ 'SEARCH_FORM_TITLE' | translate }}</h4>\n" +
    "  <hr/>\n" +
    "    <p ng-repeat=\"field in fields\" ng-if=\"field.views.index.searchable\" ng-switch=\"field.type\">\n" +
    "      <label ng-if=\"field.type !== 'hasMany'\">{{ field.label }}</label>\n" +
    "      <carnival-text-field ng-switch-when=\"wysiwyg\" data=\"searchParams[field.name]\" editable=\"true\"></carnival-text-field>\n" +
    "      <carnival-text-field ng-switch-when=\"text\" data=\"searchParams[field.name]\" editable=\"true\"></carnival-text-field>\n" +
    "      <carnival-string-field ng-switch-when=\"string\" data=\"searchParams[field.name]\" editable=\"true\"></carnival-string-field>\n" +
    "      <carnival-boolean-field ng-switch-when=\"boolean\" data=\"searchParams[field.name]\" editable=\"true\"></carnival-boolean-field>\n" +
    "      <carnival-currency-field ng-switch-when=\"currency\" data=\"searchParams[field.name]\" field=\"field\"></carnival-currency-field>\n" +
    "      <carnival-date-field ng-switch-when=\"date\" data=\"searchParams[field.name]\"></carnival-date-field>\n" +
    "      <carnival-enum-field ng-switch-when=\"enum\" data=\"searchParams[field.name]\" field=\"field\"></carnival-enum-field>\n" +
    "      <carnival-select-field ng-switch-when=\"belongsTo\" editable=\"true\" field=\"field.field\" identifier=\"field.identifier\" items=\"relatedResources[field.endpoint]\" data=\"searchParams[field.foreignKey]\"></carnival-select-field>\n" +
    "      <carnival-number-field ng-switch-when=\"number\" data=\"searchParams[field.name]\" label=\"field.label\" editable=\"true\"></carnival-number-field>\n" +
    "    </p>\n" +
    "  <hr/>\n" +
    "  <carnival-button label=\"{{ 'SEARCH_FORM_SUBMIT' | translate }}\" size=\"small\" style=\"default\" ng-click=\"submit()\"></carnival-button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/show-fields/boolean/boolean.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/boolean/boolean.html",
    "<div class=\"carnival-show-fields field-boolean\">\n" +
    "  <span ng-show=\"data\">&#10003;</span>\n" +
    "  <span ng-show=\"!data\">&#10007;</span>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/show-fields/currency/currency.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/currency/currency.html",
    "<div class=\"carnival-show-fields field-currency\">\n" +
    "  {{ toCurrency(data) }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/show-fields/date/date.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/date/date.html",
    "<div class=\"carnival-show-fields field-date\">\n" +
    "  {{ toDate(data) }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/show-fields/enum/enum.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/enum/enum.html",
    "<div class=\"carnival-show-fields field-enum\">\n" +
    "  {{ getValue(data) }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/show-fields/file/file.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/file/file.html",
    "<div class=\"carnival-show-fields field-file\">\n" +
    "  <img ng-if=\"checkIfIsImage(data)\" ng-src=\"{{ data }}\" width=\"200\" height=\"120\"/>\n" +
    "  <a ng-if=\"!checkIfIsImage(data)\" href=\"{{ data }}\">{{ data }}</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/show-fields/has-many/has-many.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/has-many/has-many.html",
    "<div class=\"carnival-show-fields field-has-many\">\n" +
    "  <ul>\n" +
    "    <li ng-repeat=\"item in data\">{{ item[field.field] }}</li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/show-fields/show-fields.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/show-fields.html",
    "<div>\n" +
    "  <label class='carnival-form-label'>\n" +
    "    {{ field.label }}\n" +
    "  </label>\n" +
    "  <div ng-switch=\"field.type\" class='carnival-form-field'>\n" +
    "    <carnival-show-string ng-switch-when=\"text\" data=\"entity.datas[field.name]\"></carnival-show-string>\n" +
    "    <carnival-show-wysiwyg ng-switch-when=\"wysiwyg\" data=\"entity.datas[field.name]\"></carnival-show-wysiwyg>\n" +
    "    <carnival-show-boolean ng-switch-when=\"boolean\" data=\"entity.datas[field.name]\"></carnival-show-boolean>\n" +
    "    <carnival-show-string ng-switch-when=\"string\" data=\"entity.datas[field.name]\"></carnival-show-string>\n" +
    "    <carnival-show-string ng-switch-when=\"number\" data=\"entity.datas[field.name]\"></carnival-show-string>\n" +
    "    <carnival-show-date ng-switch-when=\"date\" data=\"entity.datas[field.name]\"></carnival-show-date>\n" +
    "    <carnival-show-file ng-switch-when=\"file\" data=\"entity.datas[field.name]\"></carnival-show-file>\n" +
    "    <carnival-show-enum ng-switch-when=\"enum\" data=\"entity.datas[field.name]\" field=\"field\"></carnival-show-enum>\n" +
    "    <carnival-show-currency ng-switch-when=\"currency\" data=\"entity.datas[field.name]\" field=\"field\"></carnival-show-currency>\n" +
    "    <carnival-show-string ng-switch-when=\"belongsTo\" data=\"entity.datas[field.name][field.field]\"></carnival-show-string>\n" +
    "    <carnival-show-has-many ng-switch-when=\"hasMany\" data=\"entity.datas[field.name]\" field=\"field\"></carnival-show-has-many>\n" +
    "    <carnival-show-string ng-switch-default data=\"entity.datas[field.name]\"></carnival-text-field>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("components/show-fields/string/string.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/string/string.html",
    "<div class=\"carnival-show-fields field-string\">\n" +
    "  {{ data }}\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("components/show-fields/wysiwyg/wysiwyg.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/show-fields/wysiwyg/wysiwyg.html",
    "<div class=\"carnival-show-fields field-wysiwyg\">\n" +
    "  {{ data }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/summarized-items/summarized-items.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/summarized-items/summarized-items.html",
    "<div ng-click='openItems()'>\n" +
    "{{datas.length}} {{field.name}}\n" +
    "</div>\n" +
    "");
}]);

angular.module("components/uploader/uploader.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/uploader/uploader.html",
    "<div>\n" +
    "  <input type=\"file\" file-input=\"files\"></input>\n" +
    "  <carnival-button label=\"{{ 'UPLOAD_BUTTON' | translate }}\" style=\"default\" size=\"tiny\" ng-click=\"upload()\"></carnival-button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("states/main.create/create.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main.create/create.html",
    "<carnival-form-area type=\"normal\" entity=\"entity\" fields=\"entity.fields\" datas=\"entity.datas\" action=\"entity.action\" state=\"create\" related-resources=\"entity.relatedResources\" editable=\"true\"></carnival-form-area>\n" +
    "");
}]);

angular.module("states/main.edit/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main.edit/edit.html",
    "<carnival-form-area type='normal' entity=\"entity\" fields=\"entity.fields\" datas=\"entity.datas\" action=\"entity.action\" state=\"edit\" related-resources=\"entity.relatedResources\" editable=\"true\"></carnival-form-area>\n" +
    "");
}]);

angular.module("states/main.list/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main.list/list.html",
    "<div class='row'>\n" +
    "  <carnival-search-ctrl fields=\"entity.fields\" related-resources=\"entity.relatedResources\"></carnival-search-ctrl>\n" +
    "  <div class=\"carnival-list column\">\n" +
    "\n" +
    "    <div class=\"column large-10\" style=\"text-align:left\">\n" +
    "      <h3>{{ 'LIST_STATE_TITLE' | translate }} {{ entity.label }}</h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"column large-2\" style=\"text-align:right\">\n" +
    "      <carnival-button label=\"{{ 'LIST_STATE_BUTTON_CREATE' | translate }}\" style=\"success\" size=\"small\" ng-click=\"entity.actions.create()\"></carnival-button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"column large-12\">\n" +
    "      <carnival-quick-filter filters=\"entity.model.quickFilters\"></carnival-quick-filter>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <carnival-listing entity=\"entity\" entity-name=\"entity.name\" actions=\"entity.actions\" extra-actions=\"entity.extraActions\" identifier=\"entity.identifier\" datas=\"entity.datas\" fields=\"entity.fields\"></carnival-listing>\n" +
    "    <carnival-pagination-ctrl current-page=\"pages.current\" total-pages=\"pages.total\"></carnival-pagination-ctrl>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("states/main.show/show.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main.show/show.html",
    "<div class=\"carnival-show-state\">\n" +
    "\n" +
    "  <h3>{{ 'SHOW_STATE_TITLE' | translate }} {{ entity.label }}</h3>\n" +
    "\n" +
    "  <div class=\"row\" ng-repeat=\"field in entity.fields\">\n" +
    "    <carnival-show-fields class=\"column small-12\"></carnival-show-fields>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"column small-12\">\n" +
    "    <carnival-button label=\"{{ 'FORM_BUTTON_EDIT' | translate }}\" style=\"warning\" size=\"small\" ng-click=\"buttonAction()\"></carnival-button>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("states/main/main.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("states/main/main.html",
    "<div class='carnival-header'>\n" +
    "  <carnival-navbar app-name=\"app_name\" menu-items=\"menu_items\"></carnival-navbar>\n" +
    "  <div class=\"row carnival-notification\">\n" +
    "    <carnival-notification></carnival-notification>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ui-view></div>\n" +
    "");
}]);

// SweetAlert
// 2014 (c) - Tristan Edwards
// github.com/t4t5/sweetalert
;(function(window, document, undefined) {

  var modalClass   = '.sweet-alert',
      overlayClass = '.sweet-overlay',
      alertTypes   = ['error', 'warning', 'info', 'success'],
      defaultParams = {
        title: '',
        text: '',
        type: null,
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: false,
        closeOnConfirm: true,
        closeOnCancel: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#AEDEF4',
        cancelButtonText: 'Cancel',
        imageUrl: null,
        imageSize: null,
        timer: null,
        customClass: '',
        html: false,
        animation: true,
        allowEscapeKey: true
      };


  /*
   * Manipulate DOM
   */

  var getModal = function() {
      var $modal = document.querySelector(modalClass);

      if (!$modal) {
        sweetAlertInitialize();
        $modal = getModal();
      }

      return $modal;
    },
    getOverlay = function() {
      return document.querySelector(overlayClass);
    },
    hasClass = function(elem, className) {
      return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    },
    addClass = function(elem, className) {
      if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
      }
    },
    removeClass = function(elem, className) {
      var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
      if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
          newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
      }
    },
    escapeHtml = function(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    },
    _show = function(elem) {
      elem.style.opacity = '';
      elem.style.display = 'block';
    },
    show = function(elems) {
      if (elems && !elems.length) {
        return _show(elems);
      }
      for (var i = 0; i < elems.length; ++i) {
        _show(elems[i]);
      }
    },
    _hide = function(elem) {
      elem.style.opacity = '';
      elem.style.display = 'none';
    },
    hide = function(elems) {
      if (elems && !elems.length) {
        return _hide(elems);
      }
      for (var i = 0; i < elems.length; ++i) {
        _hide(elems[i]);
      }
    },
    isDescendant = function(parent, child) {
      var node = child.parentNode;
      while (node !== null) {
        if (node === parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },
    getTopMargin = function(elem) {
      elem.style.left = '-9999px';
      elem.style.display = 'block';

      var height = elem.clientHeight,
          padding;
      if (typeof getComputedStyle !== "undefined") { /* IE 8 */
        padding = parseInt(getComputedStyle(elem).getPropertyValue('padding'), 10);
      } else {
        padding = parseInt(elem.currentStyle.padding);
      }

      elem.style.left = '';
      elem.style.display = 'none';
      return ('-' + parseInt(height / 2 + padding) + 'px');
    },
    fadeIn = function(elem, interval) {
      if (+elem.style.opacity < 1) {
        interval = interval || 16;
        elem.style.opacity = 0;
        elem.style.display = 'block';
        var last = +new Date();
        var tick = function() {
          elem.style.opacity = +elem.style.opacity + (new Date() - last) / 100;
          last = +new Date();

          if (+elem.style.opacity < 1) {
            setTimeout(tick, interval);
          }
        };
        tick();
      }
      elem.style.display = 'block'; //fallback IE8
    },
    fadeOut = function(elem, interval) {
      interval = interval || 16;
      elem.style.opacity = 1;
      var last = +new Date();
      var tick = function() {
        elem.style.opacity = +elem.style.opacity - (new Date() - last) / 100;
        last = +new Date();

        if (+elem.style.opacity > 0) {
          setTimeout(tick, interval);
        } else {
          elem.style.display = 'none';
        }
      };
      tick();
    },
    fireClick = function(node) {
      // Taken from http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
      // Then fixed for today's Chrome browser.
      if (typeof MouseEvent === 'function') {
        // Up-to-date approach
        var mevt = new MouseEvent('click', {
          view: window,
          bubbles: false,
          cancelable: true
        });
        node.dispatchEvent(mevt);
      } else if ( document.createEvent ) {
        // Fallback
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', false, false);
        node.dispatchEvent(evt);
      } else if( document.createEventObject ) {
        node.fireEvent('onclick') ;
      } else if (typeof node.onclick === 'function' ) {
        node.onclick();
      }
    },
    stopEventPropagation = function(e) {
      // In particular, make sure the space bar doesn't scroll the main window.
      if (typeof e.stopPropagation === 'function') {
        e.stopPropagation();
        e.preventDefault();
      } else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
        window.event.cancelBubble = true;
      }
    };

  // Remember state in cases where opening and handling a modal will fiddle with it.
  var previousActiveElement,
      previousDocumentClick,
      previousWindowKeyDown,
      lastFocusedButton;


  /*
   * Add modal + overlay to DOM
   */

  var sweetAlertInitialize = function() {
    var sweetHTML = '<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert" tabIndex="-1"><div class="sa-icon sa-error"><span class="sa-x-mark"><span class="sa-line sa-left"></span><span class="sa-line sa-right"></span></span></div><div class="sa-icon sa-warning"> <span class="sa-body"></span> <span class="sa-dot"></span> </div> <div class="sa-icon sa-info"></div> <div class="sa-icon sa-success"> <span class="sa-line sa-tip"></span> <span class="sa-line sa-long"></span> <div class="sa-placeholder"></div> <div class="sa-fix"></div> </div> <div class="sa-icon sa-custom"></div> <h2>Title</h2><p>Text</p><button class="cancel" tabIndex="2">Cancel</button><button class="confirm" tabIndex="1">OK</button></div>',
        sweetWrap = document.createElement('div');

    sweetWrap.innerHTML = sweetHTML;

    // Append elements to body
    while (sweetWrap.firstChild) {
      document.body.appendChild(sweetWrap.firstChild);
    }
  };


  /*
   * Global sweetAlert function
   */
  var sweetAlert, swal;
  
  sweetAlert = swal = function() {
    var customizations = arguments[0];

    /*
     * Use argument if defined or default value from params object otherwise.
     * Supports the case where a default value is boolean true and should be
     * overridden by a corresponding explicit argument which is boolean false.
     */
    function argumentOrDefault(key) {
      var args = customizations;

      if (typeof args[key] !== 'undefined') {
        return args[key];
      } else {
        return defaultParams[key];
      }
    }

    if (arguments[0] === undefined) {
      logStr('SweetAlert expects at least 1 attribute!');
      return false;
    }

    var params = extend({}, defaultParams);

    switch (typeof arguments[0]) {

      // Ex: swal("Hello", "Just testing", "info");
      case 'string':
        params.title = arguments[0];
        params.text  = arguments[1] || '';
        params.type  = arguments[2] || '';

        break;

      // Ex: swal({title:"Hello", text: "Just testing", type: "info"});
      case 'object':
        if (arguments[0].title === undefined) {
          logStr('Missing "title" argument!');
          return false;
        }

        params.title = arguments[0].title;

        var availableCustoms = [
          'text',
          'type',
          'customClass',
          'allowOutsideClick',
          'showConfirmButton',
          'showCancelButton',
          'closeOnConfirm',
          'closeOnCancel',
          'timer',
          'confirmButtonColor',
          'cancelButtonText',
          'imageUrl',
          'imageSize',
          'html',
          'animation',
          'allowEscapeKey'];

        // It would be nice to just use .forEach here, but IE8... :(
        var numCustoms = availableCustoms.length;
        for (var customIndex = 0; customIndex < numCustoms; customIndex++) {
          var customName = availableCustoms[customIndex];
          params[customName] = argumentOrDefault(customName);
        }

        // Show "Confirm" instead of "OK" if cancel button is visible
        params.confirmButtonText  = (params.showCancelButton) ? 'Confirm' : defaultParams.confirmButtonText;
        params.confirmButtonText  = argumentOrDefault('confirmButtonText');

        // Function to call when clicking on cancel/OK
        params.doneFunction       = arguments[1] || null;

        break;

      default:
        logStr('Unexpected type of argument! Expected "string" or "object", got ' + typeof arguments[0]);
        return false;

    }

    setParameters(params);
    fixVerticalPosition();
    openModal();


    // Modal interactions
    var modal = getModal();

    // Mouse interactions
    var onButtonEvent = function(event) {
      var e = event || window.event;
      var target = e.target || e.srcElement,
          targetedConfirm    = (target.className.indexOf("confirm") !== -1),
          modalIsVisible     = hasClass(modal, 'visible'),
          doneFunctionExists = (params.doneFunction && modal.getAttribute('data-has-done-function') === 'true');

      switch (e.type) {
        case ("mouseover"):
          if (targetedConfirm) {
            target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.04);
          }
          break;
        case ("mouseout"):
          if (targetedConfirm) {
            target.style.backgroundColor = params.confirmButtonColor;
          }
          break;
        case ("mousedown"):
          if (targetedConfirm) {
            target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.14);
          }
          break;
        case ("mouseup"):
          if (targetedConfirm) {
            target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.04);
          }
          break;
        case ("focus"):
          var $confirmButton = modal.querySelector('button.confirm'),
              $cancelButton  = modal.querySelector('button.cancel');

          if (targetedConfirm) {
            $cancelButton.style.boxShadow = 'none';
          } else {
            $confirmButton.style.boxShadow = 'none';
          }
          break;
        case ("click"):
          if (targetedConfirm && doneFunctionExists && modalIsVisible) { // Clicked "confirm"

            params.doneFunction(true);

            if (params.closeOnConfirm) {
              sweetAlert.close();
            }
          } else if (doneFunctionExists && modalIsVisible) { // Clicked "cancel"

            // Check if callback function expects a parameter (to track cancel actions)
            var functionAsStr          = String(params.doneFunction).replace(/\s/g, '');
            var functionHandlesCancel  = functionAsStr.substring(0, 9) === "function(" && functionAsStr.substring(9, 10) !== ")";

            if (functionHandlesCancel) {
              params.doneFunction(false);
            }

            if (params.closeOnCancel) {
              sweetAlert.close();
            }
          } else {
            sweetAlert.close();
          }

          break;
      }
    };

    var $buttons = modal.querySelectorAll('button');
    for (var i = 0; i < $buttons.length; i++) {
      $buttons[i].onclick     = onButtonEvent;
      $buttons[i].onmouseover = onButtonEvent;
      $buttons[i].onmouseout  = onButtonEvent;
      $buttons[i].onmousedown = onButtonEvent;
      //$buttons[i].onmouseup   = onButtonEvent;
      $buttons[i].onfocus     = onButtonEvent;
    }

    // Remember the current document.onclick event.
    previousDocumentClick = document.onclick;
    document.onclick = function(event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;

      var clickedOnModal = (modal === target),
          clickedOnModalChild = isDescendant(modal, target),
          modalIsVisible = hasClass(modal, 'visible'),
          outsideClickIsAllowed = modal.getAttribute('data-allow-ouside-click') === 'true';

      if (!clickedOnModal && !clickedOnModalChild && modalIsVisible && outsideClickIsAllowed) {
        sweetAlert.close();
      }
    };


    // Keyboard interactions
    var $okButton = modal.querySelector('button.confirm'),
        $cancelButton = modal.querySelector('button.cancel'),
        $modalButtons = modal.querySelectorAll('button[tabindex]');


    function handleKeyDown(event) {
      var e = event || window.event;
      var keyCode = e.keyCode || e.which;

      if ([9,13,32,27].indexOf(keyCode) === -1) {
        // Don't do work on keys we don't care about.
        return;
      }

      var $targetElement = e.target || e.srcElement;

      var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
      for (var i = 0; i < $modalButtons.length; i++) {
        if ($targetElement === $modalButtons[i]) {
          btnIndex = i;
          break;
        }
      }

      if (keyCode === 9) {
        // TAB
        if (btnIndex === -1) {
          // No button focused. Jump to the confirm button.
          $targetElement = $okButton;
        } else {
          // Cycle to the next button
          if (btnIndex === $modalButtons.length - 1) {
            $targetElement = $modalButtons[0];
          } else {
            $targetElement = $modalButtons[btnIndex + 1];
          }
        }

        stopEventPropagation(e);
        $targetElement.focus();
        setFocusStyle($targetElement, params.confirmButtonColor); // TODO

      } else {
        if (keyCode === 13 || keyCode === 32) {
            if (btnIndex === -1) {
              // ENTER/SPACE clicked outside of a button.
              $targetElement = $okButton;
            } else {
              // Do nothing - let the browser handle it.
              $targetElement = undefined;
            }
        } else if (keyCode === 27 && params.allowEscapeKey === true) {
          $targetElement = $cancelButton;
        } else {
          // Fallback - let the browser handle it.
          $targetElement = undefined;
        }

        if ($targetElement !== undefined) {
          fireClick($targetElement, e);
        }
      }
    }

    previousWindowKeyDown = window.onkeydown;

    window.onkeydown = handleKeyDown;

    function handleOnBlur(event) {
      var e = event || window.event;
      var $targetElement = e.target || e.srcElement,
          $focusElement = e.relatedTarget,
          modalIsVisible = hasClass(modal, 'visible');

      if (modalIsVisible) {
        var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.

        if ($focusElement !== null) {
          // If we picked something in the DOM to focus to, let's see if it was a button.
          for (var i = 0; i < $modalButtons.length; i++) {
            if ($focusElement === $modalButtons[i]) {
              btnIndex = i;
              break;
            }
          }

          if (btnIndex === -1) {
            // Something in the dom, but not a visible button. Focus back on the button.
            $targetElement.focus();
          }
        } else {
          // Exiting the DOM (e.g. clicked in the URL bar);
          lastFocusedButton = $targetElement;
        }
      }
    }

    $okButton.onblur = handleOnBlur;
    $cancelButton.onblur = handleOnBlur;

    window.onfocus = function() {
      // When the user has focused away and focused back from the whole window.
      window.setTimeout(function() {
        // Put in a timeout to jump out of the event sequence. Calling focus() in the event
        // sequence confuses things.
        if (lastFocusedButton !== undefined) {
          lastFocusedButton.focus();
          lastFocusedButton = undefined;
        }
      }, 0);
    };
  };


  /*
   * Set default params for each popup
   * @param {Object} userParams
   */
  sweetAlert.setDefaults = swal.setDefaults = function(userParams) {
    if (!userParams) {
      throw new Error('userParams is required');
    }
    if (typeof userParams !== 'object') {
      throw new Error('userParams has to be a object');
    }

    extend(defaultParams, userParams);
  };


  /*
   * Set type, text and actions on modal
   */

  function setParameters(params) {
    var modal = getModal();

    var $title = modal.querySelector('h2'),
        $text = modal.querySelector('p'),
        $cancelBtn = modal.querySelector('button.cancel'),
        $confirmBtn = modal.querySelector('button.confirm');

    // Title
    $title.innerHTML = (params.html) ? params.title : escapeHtml(params.title).split("\n").join("<br>");

    // Text
    $text.innerHTML = (params.html) ? params.text : escapeHtml(params.text || '').split("\n").join("<br>");

    if (params.text) {
      show($text);
    }

    //Custom Class
    if (params.customClass) {
      addClass(modal, params.customClass);
      modal.setAttribute('data-custom-class', params.customClass);
    } else {
      // Find previously set classes and remove them
      var customClass = modal.getAttribute('data-custom-class');
      removeClass(modal, customClass);
      modal.setAttribute('data-custom-class', "");
    }

    // Icon
    hide(modal.querySelectorAll('.sa-icon'));
    if (params.type && !isIE8()) {
      var validType = false;
      for (var i = 0; i < alertTypes.length; i++) {
        if (params.type === alertTypes[i]) {
          validType = true;
          break;
        }
      }
      if (!validType) {
        logStr('Unknown alert type: ' + params.type);
        return false;
      }
      var $icon = modal.querySelector('.sa-icon.' + 'sa-' + params.type);
      show($icon);

      // Animate icon
      switch (params.type) {
        case "success":
          addClass($icon, 'animate');
          addClass($icon.querySelector('.sa-tip'), 'animateSuccessTip');
          addClass($icon.querySelector('.sa-long'), 'animateSuccessLong');
          break;
        case "error":
          addClass($icon, 'animateErrorIcon');
          addClass($icon.querySelector('.sa-x-mark'), 'animateXMark');
          break;
        case "warning":
          addClass($icon, 'pulseWarning');
          addClass($icon.querySelector('.sa-body'), 'pulseWarningIns');
          addClass($icon.querySelector('.sa-dot'), 'pulseWarningIns');
          break;
      }
    }

    // Custom image
    if (params.imageUrl) {
      var $customIcon = modal.querySelector('.sa-icon.sa-custom');

      $customIcon.style.backgroundImage = 'url(' + params.imageUrl + ')';
      show($customIcon);

      var _imgWidth  = 80,
          _imgHeight = 80;

      if (params.imageSize) {
        var dimensions = params.imageSize.toString().split('x');
        var imgWidth  = dimensions[0];
        var imgHeight = dimensions[1];

        if (!imgWidth || !imgHeight) {
          logStr("Parameter imageSize expects value with format WIDTHxHEIGHT, got " + params.imageSize);
        } else {
          _imgWidth  = imgWidth;
          _imgHeight = imgHeight;
        }
      }
      $customIcon.setAttribute('style', $customIcon.getAttribute('style') + 'width:' + _imgWidth + 'px; height:' + _imgHeight + 'px');
    }

    // Show cancel button?
    modal.setAttribute('data-has-cancel-button', params.showCancelButton);
    if (params.showCancelButton) {
      $cancelBtn.style.display = 'inline-block';
    } else {
      hide($cancelBtn);
    }

    // Show confirm button?
    modal.setAttribute('data-has-confirm-button', params.showConfirmButton);
    if (params.showConfirmButton) {
      $confirmBtn.style.display = 'inline-block';
    } else {
      hide($confirmBtn);
    }

    // Edit text on cancel and confirm buttons
    if (params.cancelButtonText) {
      $cancelBtn.innerHTML = escapeHtml(params.cancelButtonText);
    }
    if (params.confirmButtonText) {
      $confirmBtn.innerHTML = escapeHtml(params.confirmButtonText);
    }

    // Set confirm button to selected background color
    $confirmBtn.style.backgroundColor = params.confirmButtonColor;

    // Set box-shadow to default focused button
    setFocusStyle($confirmBtn, params.confirmButtonColor);

    // Allow outside click?
    modal.setAttribute('data-allow-ouside-click', params.allowOutsideClick);

    // Done-function
    var hasDoneFunction = (params.doneFunction) ? true : false;
    modal.setAttribute('data-has-done-function', hasDoneFunction);

    // Prevent modal from animating
    if (!params.animation){
      modal.setAttribute('data-animation', 'none');
    } else{
      modal.setAttribute('data-animation', 'pop');
    }

    // Close timer
    modal.setAttribute('data-timer', params.timer);
  }


  /*
   * Set hover, active and focus-states for buttons (source: http://www.sitepoint.com/javascript-generate-lighter-darker-color)
   */

  function colorLuminance(hex, lum) {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // Convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }

    return rgb;
  }

  function extend(a, b){
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
  }

  // Add box-shadow style to button (depending on its chosen bg-color)
  function setFocusStyle($button, bgColor) {
    var rgbColor = hexToRgb(bgColor);
    $button.style.boxShadow = '0 0 2px rgba(' + rgbColor +', 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)';
  }


  // Animation when opening modal
  function openModal() {
    var modal = getModal();
    fadeIn(getOverlay(), 10);
    show(modal);
    addClass(modal, 'showSweetAlert');
    removeClass(modal, 'hideSweetAlert');

    previousActiveElement = document.activeElement;
    var $okButton = modal.querySelector('button.confirm');
    $okButton.focus();

    setTimeout(function() {
      addClass(modal, 'visible');
    }, 500);

    var timer = modal.getAttribute('data-timer');

    if (timer !== "null" && timer !== "") {
      modal.timeout = setTimeout(function() {
        sweetAlert.close();
      }, timer);
    }
  }


  // Aninmation when closing modal
  sweetAlert.close = swal.close = function() {
    var modal = getModal();
    fadeOut(getOverlay(), 5);
    fadeOut(modal, 5);
    removeClass(modal, 'showSweetAlert');
    addClass(modal, 'hideSweetAlert');
    removeClass(modal, 'visible');


    // Reset icon animations

    var $successIcon = modal.querySelector('.sa-icon.sa-success');
    removeClass($successIcon, 'animate');
    removeClass($successIcon.querySelector('.sa-tip'), 'animateSuccessTip');
    removeClass($successIcon.querySelector('.sa-long'), 'animateSuccessLong');

    var $errorIcon = modal.querySelector('.sa-icon.sa-error');
    removeClass($errorIcon, 'animateErrorIcon');
    removeClass($errorIcon.querySelector('.sa-x-mark'), 'animateXMark');

    var $warningIcon = modal.querySelector('.sa-icon.sa-warning');
    removeClass($warningIcon, 'pulseWarning');
    removeClass($warningIcon.querySelector('.sa-body'), 'pulseWarningIns');
    removeClass($warningIcon.querySelector('.sa-dot'), 'pulseWarningIns');


    // Reset the page to its previous state
    window.onkeydown = previousWindowKeyDown;
    document.onclick = previousDocumentClick;
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
    lastFocusedButton = undefined;
    clearTimeout(modal.timeout);
  };


  /*
   * Set "margin-top"-property on modal based on its computed height
   */

  function fixVerticalPosition() {
    var modal = getModal();

    modal.style.marginTop = getTopMargin(getModal());
  }

  // If browser is Internet Explorer 8
  function isIE8() {
    if (window.attachEvent && !window.addEventListener) {
      return true;
    } else {
      return false;
    }
  }

  // Error messages for developers
  function logStr(string) {
    if (window.console) { // IE...
      window.console.log("SweetAlert: " + string);
    }
  }

    if (typeof define === 'function' && define.amd) {
      define(function() { return sweetAlert; });
    } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = sweetAlert;
    } else if (typeof window !== 'undefined') {
      window.sweetAlert = window.swal = sweetAlert;
    }

})(window, document);

/**
 * State-based routing for AngularJS
 * @version v0.2.18
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
    copy = angular.copy,
    toJson = angular.toJson;

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

  forEach(object, function(val, key) {
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
    if (!parents[i] || !parents[i].params) continue;
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
   * Cyclic dependencies between invocables are not permitted and will cause `$resolve`
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
  //    \{([\w\[\]]+)(?:\:\s*( ... ))?\}  - curly brace placeholder ($3) with optional regexp/type ... ($4) (search version has - for snake-case
  //    (?: ... | ... | ... )+         - the regexp consists of any number of atoms, an atom being either
  //    [^{}\\]+                       - anything other than curly braces or backslash
  //    \\.                            - a backslash escape
  //    \{(?:[^{}\\]+|\\.)*\}          - a matched set of curly braces containing other atoms
  var placeholder       = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
      searchPlaceholder = /([:]?)([\w\[\].-]+)|\{([\w\[\].-]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
      compiled = '^', last = 0, m,
      segments = this.segments = [],
      parentParams = parentMatcher ? parentMatcher.params : {},
      params = this.params = parentMatcher ? parentMatcher.params.$$new() : new $$UMFP.ParamSet(),
      paramNames = [];

  function addParameter(id, type, config, location) {
    paramNames.push(id);
    if (parentParams[id]) return parentParams[id];
    if (!/^\w+([-.]+\w+)*(?:\[\])?$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
    if (params[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
    params[id] = new $$UMFP.Param(id, type, config, location);
    return params[id];
  }

  function quoteRegExp(string, pattern, squash, optional) {
    var surroundPattern = ['',''], result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
    if (!pattern) return result;
    switch(squash) {
      case false: surroundPattern = ['(', ')' + (optional ? "?" : "")]; break;
      case true:
        result = result.replace(/\/$/, '');
        surroundPattern = ['(?:\/(', ')|\/)?'];
      break;
      default:    surroundPattern = ['(' + squash + "|", ')?']; break;
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

    if (regexp) {
      type      = $$UMFP.type(regexp) || inherit($$UMFP.type("string"), { pattern: new RegExp(regexp, config.caseInsensitive ? 'i' : undefined) });
    }

    return {
      id: id, regexp: regexp, segment: segment, type: type, cfg: cfg
    };
  }

  var p, param, segment;
  while ((m = placeholder.exec(pattern))) {
    p = matchDetails(m, false);
    if (p.segment.indexOf('?') >= 0) break; // we're into the search part

    param = addParameter(p.id, p.type, p.cfg, "path");
    compiled += quoteRegExp(p.segment, param.type.pattern.source, param.squash, param.isOptional);
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
    function unquoteDashes(str) { return str.replace(/\\-/g, "-"); }

    var split = reverseString(string).split(/-(?!\\)/);
    var allReversed = map(split, reverseString);
    return map(allReversed, unquoteDashes).reverse();
  }

  var param, paramVal;
  for (i = 0; i < nPath; i++) {
    paramName = paramNames[i];
    param = this.params[paramName];
    paramVal = m[i+1];
    // if the param value matches a pre-replace pair, replace the value before decoding.
    for (j = 0; j < param.replace.length; j++) {
      if (param.replace[j].from === paramVal) paramVal = param.replace[j].to;
    }
    if (paramVal && param.array === true) paramVal = decodePathArray(paramVal);
    if (isDefined(paramVal)) paramVal = param.type.decode(paramVal);
    values[paramName] = param.value(paramVal);
  }
  for (/**/; i < nTotal; i++) {
    paramName = paramNames[i];
    values[paramName] = this.params[paramName].value(searchParams[paramName]);
    param = this.params[paramName];
    paramVal = searchParams[paramName];
    for (j = 0; j < param.replace.length; j++) {
      if (param.replace[j].from === paramVal) paramVal = param.replace[j].to;
    }
    if (isDefined(paramVal)) paramVal = param.type.decode(paramVal);
    values[paramName] = param.value(paramVal);
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
 * @name ui.router.util.type:UrlMatcher#validates
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
      var isFinalPathParam = i + 1 === nPath;

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

      if (isFinalPathParam && param.squash === true && result.slice(-1) === '/') result = result.slice(0, -1);
    } else {
      if (encoded == null || (isDefaultValue && squash !== false)) continue;
      if (!isArray(encoded)) encoded = [ encoded ];
      if (encoded.length === 0) continue;
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

/** Given an encoded string, or a decoded object, returns a decoded object */
Type.prototype.$normalize = function(val) {
  return this.is(val) ? val : this.decode(val);
};

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
        if (isArray(val) && val.length === 0) return val;
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
    this.$normalize = arrayHandler(bindTo(type, '$normalize'));
    this.name = type.name;
    this.$arrayMode = mode;
  }

  return new ArrayType(this, mode);
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

  // Use tildes to pre-encode slashes.
  // If the slashes are simply URLEncoded, the browser can choose to pre-decode them,
  // and bidirectional encoding/decoding fails.
  // Tilde was chosen because it's not a RFC 3986 section 2.2 Reserved Character
  function valToString(val) { return val != null ? val.toString().replace(/~/g, "~~").replace(/\//g, "~2F") : val; }
  function valFromString(val) { return val != null ? val.toString().replace(/~2F/g, "/").replace(/~~/g, "~") : val; }

  var $types = {}, enqueue = true, typeQueue = [], injector, defaultTypes = {
    "string": {
      encode: valToString,
      decode: valFromString,
      // TODO: in 1.0, make string .is() return false if value is undefined/null by default.
      // In 0.2.x, string params are optional by default for backwards compat
      is: function(val) { return val == null || !isDefined(val) || typeof val === "string"; },
      pattern: /[^/]*/
    },
    "int": {
      encode: valToString,
      decode: function(val) { return parseInt(val, 10); },
      is: function(val) { return isDefined(val) && this.decode(val.toString()) === val; },
      pattern: /\d+/
    },
    "bool": {
      encode: function(val) { return val ? 1 : 0; },
      decode: function(val) { return parseInt(val, 10) !== 0; },
      is: function(val) { return val === true || val === false; },
      pattern: /0|1/
    },
    "date": {
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
    "json": {
      encode: angular.toJson,
      decode: angular.fromJson,
      is: angular.isObject,
      equals: angular.equals,
      pattern: /[^/]*/
    },
    "any": { // does not encode/decode
      encode: angular.identity,
      decode: angular.identity,
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

      if (angular.isString(config.type))
        return $types[config.type];
      if (config.type instanceof Type)
        return config.type;
      return new Type(config.type);
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
      var defaultValue = injector.invoke(config.$$fn);
      if (defaultValue !== null && defaultValue !== undefined && !self.type.is(defaultValue))
        throw new Error("Default value (" + defaultValue + ") for parameter '" + self.id + "' is not an instance of Type (" + self.type.name + ")");
      return defaultValue;
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
      return !isDefined(value) ? $$getDefaultValue() : self.type.$normalize(value);
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
      var keys = this.$$keys(), i, param, rawVal, normalized, encoded;
      for (i = 0; i < keys.length; i++) {
        param = this[keys[i]];
        rawVal = paramValues[keys[i]];
        if ((rawVal === undefined || rawVal === null) && param.isOptional)
          break; // There was no parameter value, but the param is optional
        normalized = param.type.$normalize(rawVal);
        if (!param.type.is(normalized))
          return false; // The value was not of the correct Type, and could not be decoded to the correct Type
        encoded = param.type.encode(normalized);
        if (angular.isString(encoded) && !param.type.pattern.exec(encoded))
          return false; // The value was of the correct type, but when encoded, did not match the Type's regexp
      }
      return true;
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
   * @param {function} rule Handler function that takes `$injector` and `$location`
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
   * @param {string|function} rule The url path you want to redirect to or a function 
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
   * Registers a handler for a given url matching. 
   * 
   * If the handler is a string, it is
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
   * @param {string|function} handler The path you want to redirect your user to.
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
  $get.$inject = ['$location', '$rootScope', '$injector', '$browser', '$sniffer'];
  function $get(   $location,   $rootScope,   $injector,   $browser,   $sniffer) {

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
      // TODO: Re-implement this in 1.0 for https://github.com/angular-ui/ui-router/issues/1573
      //if (ignoreUpdate) return true;

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
         var url = urlMatcher.format(params || {});

        // Handle the special hash param, if needed
        if (url !== null && params && params['#']) {
            url += '#' + params['#'];
        }

        $location.url(url);
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

        isHtml5 = isHtml5 && $sniffer.history;
        
        var url = urlMatcher.format(params);
        options = options || {};

        if (!isHtml5 && url !== null) {
          url = "#" + $locationProvider.hashPrefix() + url;
        }

        // Handle special hash param, if needed
        if (url !== null && params && params['#']) {
          url += '#' + params['#'];
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
        state.data = state.self.data = inherit(state.parent.data, state.data);
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
      var ownParams = pick(state.ownParams, state.ownParams.$$keys());
      return state.parent && state.parent.params ? extend(state.parent.params.$$new(), ownParams) : new $$UMFP.ParamSet();
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
    if (states.hasOwnProperty(name)) throw new Error("State '" + name + "' is already defined");

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

    //match single stars
    for (var i = 0, l = globSegments.length; i < l; i++) {
      if (globSegments[i] === '*') {
        segments[i] = '*';
      }
    }

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
   * @param {string|object=} stateConfig.parent
   * <a id='parent'></a>
   * Optionally specifies the parent state of this state.
   *
   * <pre>parent: 'parentState'</pre>
   * <pre>parent: parentState // JS variable</pre>
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
   *   (See {@link ui.router.util.type:UrlMatcher UrlMatcher} `UrlMatcher`} for
   *   more details on acceptable patterns )
   *
   * examples:
   * <pre>url: "/home"
   * url: "/users/:userid"
   * url: "/books/{bookid:[a-zA-Z_-]}"
   * url: "/books/{categoryid:int}"
   * url: "/books/{publishername:string}/{categoryid:int}"
   * url: "/messages?before&after"
   * url: "/messages?{before:date}&{after:date}"
   * url: "/messages/:mailboxid?{before:date}&{after:date}"
   * </pre>
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
   * If minifying your scripts, make sure to explicitly annotate this function,
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
   * If minifying your scripts, make sure to explicitly annotate this function,
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
     * A method that force reloads the current state. All resolves are re-resolved,
     * controllers reinstantiated, and events re-fired.
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
     * @param {string=|object=} state - A state name or a state object, which is the root of the resolves to be re-resolved.
     * @example
     * <pre>
     * //assuming app application consists of 3 states: 'contacts', 'contacts.detail', 'contacts.detail.item' 
     * //and current state is 'contacts.detail.item'
     * var app angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.reload = function(){
     *     //will reload 'contact.detail' and 'contact.detail.item' states
     *     $state.reload('contact.detail');
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

     * @returns {promise} A promise representing the state of the new transition. See
     * {@link ui.router.state.$state#methods_go $state.go}.
     */
    $state.reload = function reload(state) {
      return $state.transitionTo($state.current, $stateParams, { reload: state || true, inherit: false, notify: true});
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
     * defined parameters. Only parameters specified in the state definition can be overridden, new 
     * parameters will be ignored. This allows, for example, going to a sibling state that shares parameters
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
     * - **`reload`** (v0.2.5) - {boolean=false|string|object}, If `true` will force transition even if no state or params
     *    have changed.  It will reload the resolves and views of the current state and parent states.
     *    If `reload` is a string (or state object), the state object is fetched (by name, or object reference); and \
     *    the transition reloads the resolves and views for that matched state, and all its children states.
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
     * - **`reload`** (v0.2.5) - {boolean=false|string=|object=}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *    if String, then will reload the state with the name given in reload, and any children.
     *    if Object, then a stateObj is expected, will reload the state found in stateObj, and any children.
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

      // Store the hash param for later (since it will be stripped out by various methods)
      var hash = toParams['#'];

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
      } else if (isString(options.reload) || isObject(options.reload)) {
        if (isObject(options.reload) && !options.reload.name) {
          throw new Error('Invalid reload state object');
        }
        
        var reloadState = options.reload === true ? fromPath[0] : findState(options.reload);
        if (options.reload && !reloadState) {
          throw new Error("No such reload state '" + (isString(options.reload) ? options.reload : options.reload.name) + "'");
        }

        while (state && state === fromPath[keep] && state !== reloadState) {
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
      if (shouldSkipReload(to, toParams, from, fromParams, locals, options)) {
        if (hash) toParams['#'] = hash;
        $state.params = toParams;
        copy($state.params, $stateParams);
        copy(filterByKeys(to.params.$$keys(), $stateParams), to.locals.globals.$stateParams);
        if (options.location && to.navigable && to.navigable.url) {
          $urlRouter.push(to.navigable.url, toParams, {
            $$avoidResync: true, replace: options.location === 'replace'
          });
          $urlRouter.update(true);
        }
        $state.transition = null;
        return $q.when($state.current);
      }

      // Filter parameters before we pass them to event handlers etc.
      toParams = filterByKeys(to.params.$$keys(), toParams || {});
      
      // Re-add the saved hash before we start returning things or broadcasting $stateChangeStart
      if (hash) toParams['#'] = hash;
      
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
        if ($rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams, options).defaultPrevented) {
          $rootScope.$broadcast('$stateChangeCancel', to.self, toParams, from.self, fromParams);
          //Don't update and resync url if there's been a new transition started. see issue #2238, #600
          if ($state.transition == null) $urlRouter.update();
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
      return $urlRouter.href(nav.url, filterByKeys(state.params.$$keys().concat('#'), params || {}), {
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

      function resolveViews() {
        var viewsPromises = [];

        // Resolve template and dependencies for all views.
        forEach(state.views, function (view, name) {
          var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
          injectables.$template = [ function () {
            return $view.load(name, { view: view, locals: dst.globals, params: $stateParams, notify: options.notify }) || '';
          }];

          viewsPromises.push($resolve.resolve(injectables, dst.globals, dst.resolve, state).then(function (result) {
            // References to the controller (only instantiated at link time)
            if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
              var injectLocals = angular.extend({}, injectables, dst.globals);
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

        return $q.all(viewsPromises).then(function(){
          return dst.globals;
        });
      }

      // Wait for all the promises and then return the activation object
      return $q.all(promises).then(resolveViews).then(function (values) {
        return dst;
      });
    }

    return $state;
  }

  function shouldSkipReload(to, toParams, from, fromParams, locals, options) {
    // Return true if there are no differences in non-search (path/object) params, false if there are differences
    function nonSearchParamsEqual(fromAndToState, fromParams, toParams) {
      // Identify whether all the parameters that differ between `fromParams` and `toParams` were search params.
      function notSearchParam(key) {
        return fromAndToState.params[key].location != "search";
      }
      var nonQueryParamKeys = fromAndToState.params.$$keys().filter(notSearchParam);
      var nonQueryParams = pick.apply({}, [fromAndToState.params].concat(nonQueryParamKeys));
      var nonQueryParamSet = new $$UMFP.ParamSet(nonQueryParams);
      return nonQueryParamSet.$$equals(fromParams, toParams);
    }

    // If reload was not explicitly requested
    // and we're transitioning to the same state we're already in
    // and    the locals didn't change
    //     or they changed in a way that doesn't merit reloading
    //        (reloadOnParams:false, or reloadOnSearch.false and only search params changed)
    // Then return true.
    if (!options.reload && to === from &&
      (locals === from.locals || (to.self.reloadOnSearch === false && nonSearchParamsEqual(from, fromParams, toParams)))) {
      return true;
    }
  }
}

angular.module('ui.router.state')
  .factory('$stateParams', function () { return {}; })
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
      return $timeout(function () {
        $element[0].scrollIntoView();
      }, 0, false);
    };
  }];
}

angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

var ngMajorVer = angular.version.major;
var ngMinorVer = angular.version.minor;
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
 * @param {string=} noanimation If truthy, the non-animated renderer will be selected (no animations
 * will be applied to the ui-view)
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
    var statics = {
      enter: function (element, target, cb) { target.after(element); cb(); },
      leave: function (element, cb) { element.remove(); cb(); }
    };

    if (!!attrs.noanimation) return statics;

    function animEnabled(element) {
      if (ngMajorVer === 1 && ngMinorVer >= 4) return !!$animate.enabled(element);
      if (ngMajorVer === 1 && ngMinorVer >= 2) return !!$animate.enabled();
      return (!!$animator);
    }

    // ng 1.2+
    if ($animate) {
      return {
        enter: function(element, target, cb) {
          if (!animEnabled(element)) {
            statics.enter(element, target, cb);
          } else if (angular.version.minor > 2) {
            $animate.enter(element, null, target).then(cb);
          } else {
            $animate.enter(element, null, target, cb);
          }
        },
        leave: function(element, cb) {
          if (!animEnabled(element)) {
            statics.leave(element, cb);
          } else if (angular.version.minor > 2) {
            $animate.leave(element).then(cb);
          } else {
            $animate.leave(element, cb);
          }
        }
      };
    }

    // ng 1.1.5
    if ($animator) {
      var animate = $animator && $animator(scope, attrs);

      return {
        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
        leave: function(element, cb) { animate.leave(element); cb(); }
      };
    }

    return statics;
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

        updateView(true);

        function cleanupLastView() {
          var _previousEl = previousEl;
          var _currentScope = currentScope;

          if (_currentScope) {
            _currentScope._willBeDestroyed = true;
          }

          function cleanOld() {
            if (_previousEl) {
              _previousEl.remove();
            }

            if (_currentScope) {
              _currentScope.$destroy();
            }
          }

          if (currentEl) {
            renderer.leave(currentEl, function() {
              cleanOld();
              previousEl = null;
            });

            previousEl = currentEl;
          } else {
            cleanOld();
            previousEl = null;
          }

          currentEl = null;
          currentScope = null;
        }

        function updateView(firstTime) {
          var newScope,
              name            = getUiViewName(scope, attrs, $element, $interpolate),
              previousLocals  = name && $state.$current && $state.$current.locals[name];

          if (!firstTime && previousLocals === latestLocals || scope._willBeDestroyed) return; // nothing to do
          newScope = scope.$new();
          latestLocals = $state.$current.locals[name];

          /**
           * @ngdoc event
           * @name ui.router.state.directive:ui-view#$viewContentLoading
           * @eventOf ui.router.state.directive:ui-view
           * @eventType emits on ui-view directive scope
           * @description
           *
           * Fired once the view **begins loading**, *before* the DOM is rendered.
           *
           * @param {Object} event Event object.
           * @param {string} viewName Name of the view.
           */
          newScope.$emit('$viewContentLoading', name);

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
           * @description
           * Fired once the view is **loaded**, *after* the DOM is rendered.
           *
           * @param {Object} event Event object.
           * @param {string} viewName Name of the view.
           */
          currentScope.$emit('$viewContentLoaded', name);
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
          locals.$element = $element;
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

function getTypeInfo(el) {
  // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
  var isSvg = Object.prototype.toString.call(el.prop('href')) === '[object SVGAnimatedString]';
  var isForm = el[0].nodeName === "FORM";

  return {
    attr: isForm ? "action" : (isSvg ? 'xlink:href' : 'href'),
    isAnchor: el.prop("tagName").toUpperCase() === "A",
    clickable: !isForm
  };
}

function clickHook(el, $state, $timeout, type, current) {
  return function(e) {
    var button = e.which || e.button, target = current();

    if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || el.attr('target'))) {
      // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
      var transition = $timeout(function() {
        $state.go(target.state, target.params, target.options);
      });
      e.preventDefault();

      // if the state has no URL, ignore one preventDefault from the <a> directive.
      var ignorePreventDefaultCount = type.isAnchor && !target.href ? 1: 0;

      e.preventDefault = function() {
        if (ignorePreventDefaultCount-- <= 0) $timeout.cancel(transition);
      };
    }
  };
}

function defaultOpts(el, $state) {
  return { relative: stateContext(el) || $state.$current, inherit: true };
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
  return {
    restrict: 'A',
    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
    link: function(scope, element, attrs, uiSrefActive) {
      var ref    = parseStateRef(attrs.uiSref, $state.current.name);
      var def    = { state: ref.state, href: null, params: null };
      var type   = getTypeInfo(element);
      var active = uiSrefActive[1] || uiSrefActive[0];

      def.options = extend(defaultOpts(element, $state), attrs.uiSrefOpts ? scope.$eval(attrs.uiSrefOpts) : {});

      var update = function(val) {
        if (val) def.params = angular.copy(val);
        def.href = $state.href(ref.state, def.params, def.options);

        if (active) active.$$addStateInfo(ref.state, def.params);
        if (def.href !== null) attrs.$set(type.attr, def.href);
      };

      if (ref.paramExpr) {
        scope.$watch(ref.paramExpr, function(val) { if (val !== def.params) update(val); }, true);
        def.params = angular.copy(scope.$eval(ref.paramExpr));
      }
      update();

      if (!type.clickable) return;
      element.bind("click", clickHook(element, $state, $timeout, type, function() { return def; }));
    }
  };
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-state
 *
 * @requires ui.router.state.uiSref
 *
 * @restrict A
 *
 * @description
 * Much like ui-sref, but will accept named $scope properties to evaluate for a state definition,
 * params and override options.
 *
 * @param {string} ui-state 'stateName' can be any valid absolute or relative state
 * @param {Object} ui-state-params params to pass to {@link ui.router.state.$state#href $state.href()}
 * @param {Object} ui-state-opts options to pass to {@link ui.router.state.$state#go $state.go()}
 */
$StateRefDynamicDirective.$inject = ['$state', '$timeout'];
function $StateRefDynamicDirective($state, $timeout) {
  return {
    restrict: 'A',
    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
    link: function(scope, element, attrs, uiSrefActive) {
      var type   = getTypeInfo(element);
      var active = uiSrefActive[1] || uiSrefActive[0];
      var group  = [attrs.uiState, attrs.uiStateParams || null, attrs.uiStateOpts || null];
      var watch  = '[' + group.map(function(val) { return val || 'null'; }).join(', ') + ']';
      var def    = { state: null, params: null, options: null, href: null };

      function runStateRefLink (group) {
        def.state = group[0]; def.params = group[1]; def.options = group[2];
        def.href = $state.href(def.state, def.params, def.options);

        if (active) active.$$addStateInfo(def.state, def.params);
        if (def.href) attrs.$set(type.attr, def.href);
      }

      scope.$watch(watch, runStateRefLink, true);
      runStateRefLink(scope.$eval(watch));

      if (!type.clickable) return;
      element.bind("click", clickHook(element, $state, $timeout, type, function() { return def; }));
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
 *
 * It is also possible to pass ui-sref-active an expression that evaluates
 * to an object hash, whose keys represent active class names and whose
 * values represent the respective state names/globs.
 * ui-sref-active will match if the current active state **includes** any of
 * the specified state names/globs, even the abstract ones.
 *
 * @Example
 * Given the following template, with "admin" being an abstract state:
 * <pre>
 * <div ui-sref-active="{'active': 'admin.*'}">
 *   <a ui-sref-active="active" ui-sref="admin.roles">Roles</a>
 * </div>
 * </pre>
 *
 * When the current state is "admin.roles" the "active" class will be applied
 * to both the <div> and <a> elements. It is important to note that the state
 * names/globs passed to ui-sref-active shadow the state provided by ui-sref.
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
    controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
      var states = [], activeClasses = {}, activeEqClass, uiSrefActive;

      // There probably isn't much point in $observing this
      // uiSrefActive and uiSrefActiveEq share the same directive object with some
      // slight difference in logic routing
      activeEqClass = $interpolate($attrs.uiSrefActiveEq || '', false)($scope);

      try {
        uiSrefActive = $scope.$eval($attrs.uiSrefActive);
      } catch (e) {
        // Do nothing. uiSrefActive is not a valid expression.
        // Fall back to using $interpolate below
      }
      uiSrefActive = uiSrefActive || $interpolate($attrs.uiSrefActive || '', false)($scope);
      if (isObject(uiSrefActive)) {
        forEach(uiSrefActive, function(stateOrName, activeClass) {
          if (isString(stateOrName)) {
            var ref = parseStateRef(stateOrName, $state.current.name);
            addState(ref.state, $scope.$eval(ref.paramExpr), activeClass);
          }
        });
      }

      // Allow uiSref to communicate with uiSrefActive[Equals]
      this.$$addStateInfo = function (newState, newParams) {
        // we already got an explicit state provided by ui-sref-active, so we
        // shadow the one that comes from ui-sref
        if (isObject(uiSrefActive) && states.length > 0) {
          return;
        }
        addState(newState, newParams, uiSrefActive);
        update();
      };

      $scope.$on('$stateChangeSuccess', update);

      function addState(stateName, stateParams, activeClass) {
        var state = $state.get(stateName, stateContext($element));
        var stateHash = createStateHash(stateName, stateParams);

        states.push({
          state: state || { name: stateName },
          params: stateParams,
          hash: stateHash
        });

        activeClasses[stateHash] = activeClass;
      }

      /**
       * @param {string} state
       * @param {Object|string} [params]
       * @return {string}
       */
      function createStateHash(state, params) {
        if (!isString(state)) {
          throw new Error('state should be a string');
        }
        if (isObject(params)) {
          return state + toJson(params);
        }
        params = $scope.$eval(params);
        if (isObject(params)) {
          return state + toJson(params);
        }
        return state;
      }

      // Update route state
      function update() {
        for (var i = 0; i < states.length; i++) {
          if (anyMatch(states[i].state, states[i].params)) {
            addClass($element, activeClasses[states[i].hash]);
          } else {
            removeClass($element, activeClasses[states[i].hash]);
          }

          if (exactMatch(states[i].state, states[i].params)) {
            addClass($element, activeEqClass);
          } else {
            removeClass($element, activeEqClass);
          }
        }
      }

      function addClass(el, className) { $timeout(function () { el.addClass(className); }); }
      function removeClass(el, className) { el.removeClass(className); }
      function anyMatch(state, params) { return $state.includes(state.name, params); }
      function exactMatch(state, params) { return $state.is(state.name, params); }

      update();
    }]
  };
}

angular.module('ui.router.state')
  .directive('uiSref', $StateRefDirective)
  .directive('uiSrefActive', $StateRefActiveDirective)
  .directive('uiSrefActiveEq', $StateRefActiveDirective)
  .directive('uiState', $StateRefDynamicDirective);

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
  var isFilter = function (state, params) {
    return $state.is(state, params);
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
  var includesFilter = function (state, params, options) {
    return $state.includes(state, params, options);
  };
  includesFilter.$stateful = true;
  return  includesFilter;
}

angular.module('ui.router.state')
  .filter('isState', $IsStateFilter)
  .filter('includedByState', $IncludedByStateFilter);
})(window, window.angular);
/**
 * No box-sizing, such a shame
 *
 * 1.Calculate outer height
 * @param   bool    Include margin
 * @returns Number  Height in pixels
 *
 * 2. Set outer height
 * @param   Number          Height in pixels
 * @param   bool            Include margin
 * @returns angular.element Collection
 */
if (typeof angular.element.prototype.outerHeight !== 'function') {

angular.element.prototype.outerHeight = function() {
  function parsePixels(cssString) {
    if (cssString.slice(-2) === 'px') {
      return parseFloat(cssString.slice(0, -2));
    }
    return 0;
  }

  var includeMargin = false, height, $element = this.eq(0), element = $element[0];

  if (arguments[0] === true || arguments[0] === false || arguments[0] === undefined) {
    if (!$element.length) {
      return 0;
    }

    includeMargin = arguments[0] && true || false;

    if (element.outerHeight) {
      height = element.outerHeight;
    } else {
      height = element.offsetHeight;
    }
    if (includeMargin) {
      height += parsePixels($element.css('marginTop')) + parsePixels($element.css('marginBottom'));
    }
    return height;

  } else {
    if (!$element.length) {
      return this;
    }

    height = parseFloat(arguments[0]);

    includeMargin = arguments[1] && true || false;

    if (includeMargin) {
      height -= parsePixels($element.css('marginTop')) + parsePixels($element.css('marginBottom'));
    }

    height -= parsePixels($element.css('borderTopWidth')) + parsePixels($element.css('borderBottomWidth')) +
        parsePixels($element.css('paddingTop')) + parsePixels($element.css('paddingBottom'));

    $element.css('height', height + 'px');
    return this;
  }
};

}

angular.module('ngWig', ['ngwig-app-templates']);

angular.module('ngWig').directive('ngWig', function () {

      return {
        scope: {
          content: '=ngWig',
          debug: '&',
          cssPath: '@'
        },
        restrict: 'A',
        replace: true,
        templateUrl: 'ng-wig/views/ng-wig.html',
        link: function (scope, element, attrs) {

          scope.originalHeight = element.outerHeight();
          scope.editMode = false;
          scope.autoexpand = !('autoexpand' in attrs) || attrs['autoexpand'] !== 'off';
          scope.cssPath = scope.cssPath ? scope.cssPath : 'css/ng-wig.css';

          scope.toggleEditMode = function() {
            scope.editMode = !scope.editMode;
          };

          scope.execCommand = function (command, options) {
            if(command ==='createlink'){
              options = prompt('Please enter the URL', 'http://');
            }
            scope.$emit('execCommand', {command: command, options: options});
          };

          scope.resizeEditor = function(height) {
            var children = element.children();
            for (var i in children) {
              var child = children.eq(i);
              if (child.hasClass('nw-editor')) {
                child.outerHeight(height);
                break;
              }
            }

          }
        }
      }
    }
);


angular.module('ngWig').directive('ngWigEditable', function () {
      function init(scope, $element, attrs, ctrl) {
        var $document = $element[0].contentDocument,
            $body;
        $document.open();
        $document.write('<!DOCTYPE html><html style="height:100%"><head>'+ (scope.cssPath ? ('<link href="'+ scope.cssPath +'" rel="stylesheet" type="text/css">') : '') + '</head><body contenteditable="true" style="height:100%; margin: 0; padding: 8px;box-sizing: border-box;"></body></html>');
        $document.close();

        $body = angular.element($element[0].contentDocument.body);

        //model --> view
        ctrl.$render = function () {
          $body[0].innerHTML = ctrl.$viewValue || '';
        };

        //view --> model
        $body.bind('blur keyup change paste', function () {
          resizeEditor();
          scope.$apply(function blurkeyup() {
            ctrl.$setViewValue($body.html());
          });
        });

        scope.$on('execCommand', function (event, params) {
          var sel = $document.selection,
              command = params.command,
              options = params.options;
          if (sel) {
            var textRange = sel.createRange();
            $document.execCommand(command, false, options);
            textRange.collapse(false);
            textRange.select();
          }
          else {
            $document.execCommand(command, false, options);
          }
          $document.body.focus();
          //sync
          scope.$evalAsync(function () {
            ctrl.$setViewValue($body.html());
            resizeEditor();
          });
        });

        function resizeEditor() {
          if (!scope.autoexpand) {
            var height = scope.originalHeight;
          } else {
            height = angular.element($document.documentElement).outerHeight();
          }
          scope.resizeEditor(height);
        }

        scope.$watch('autoexpand', resizeEditor);
        scope.$watch('editMode', function(oldMode, newMode) {
          if (newMode) {
            resizeEditor();
          }
        });
      }

      return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        link: init
      }
    }
);

angular.module('ngwig-app-templates', ['ng-wig/views/ng-wig.html']);

angular.module("ng-wig/views/ng-wig.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ng-wig/views/ng-wig.html",
    "<div class=\"ng-wig\">\n" +
    "  <ul class=\"nw-toolbar\">\n" +
    "    <li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--header-one\" title=\"Header\" ng-click=\"execCommand('formatblock', '<h1>')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--paragraph\" title=\"Paragraph\" ng-click=\"execCommand('formatblock', '<p>')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--unordered-list\" title=\"Unordered List\" ng-click=\"execCommand('insertunorderedlist')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--ordered-list\" title=\"Ordered List\" ng-click=\"execCommand('insertorderedlist')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--bold\" title=\"Bold\" ng-click=\"execCommand('bold')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--italic\" title=\"Italic\" ng-click=\"execCommand('italic')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--link\" title=\"link\" ng-click=\"execCommand('createlink')\"></button>\n" +
    "    </li><!--\n" +
    "    --><li class=\"nw-toolbar__item\">\n" +
    "      <button type=\"button\" class=\"nw-button nw-button--source\" ng-class=\"{ 'nw-button--active': editMode }\" ng-click=\"toggleEditMode()\"></button>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"nw-editor\">\n" +
    "    <textarea class=\"nw-editor__src\" ng-show=\"editMode\" ng-model=\"content\"></textarea>\n" +
    "    <iframe scrolling=\"{{ autoexpand ? 'no' : 'yes' }}\" class=\"nw-editor__res\" frameBorder=\"0\" ng-hide=\"editMode\" ng-model=\"content\" ng-wig-editable></iframe>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

/**
  * x is a value between 0 and 1, indicating where in the animation you are.
  */
var duScrollDefaultEasing = function (x) {
  'use strict';

  if(x < 0.5) {
    return Math.pow(x*2, 2)/2;
  }
  return 1-Math.pow((1-x)*2, 2)/2;
};

angular.module('duScroll', [
  'duScroll.scrollspy',
  'duScroll.smoothScroll',
  'duScroll.scrollContainer',
  'duScroll.spyContext',
  'duScroll.scrollHelpers'
])
  //Default animation duration for smoothScroll directive
  .value('duScrollDuration', 350)
  //Scrollspy debounce interval, set to 0 to disable
  .value('duScrollSpyWait', 100)
  //Wether or not multiple scrollspies can be active at once
  .value('duScrollGreedy', false)
  //Default offset for smoothScroll directive
  .value('duScrollOffset', 0)
  //Default easing function for scroll animation
  .value('duScrollEasing', duScrollDefaultEasing);


angular.module('duScroll.scrollHelpers', ['duScroll.requestAnimation'])
.run(["$window", "$q", "cancelAnimation", "requestAnimation", "duScrollEasing", "duScrollDuration", "duScrollOffset", function($window, $q, cancelAnimation, requestAnimation, duScrollEasing, duScrollDuration, duScrollOffset) {
  'use strict';

  var proto = {};

  var isDocument = function(el) {
    return (typeof HTMLDocument !== 'undefined' && el instanceof HTMLDocument) || (el.nodeType && el.nodeType === el.DOCUMENT_NODE);
  };

  var isElement = function(el) {
    return (typeof HTMLElement !== 'undefined' && el instanceof HTMLElement) || (el.nodeType && el.nodeType === el.ELEMENT_NODE);
  };

  var unwrap = function(el) {
    return isElement(el) || isDocument(el) ? el : el[0];
  };

  proto.duScrollTo = function(left, top, duration, easing) {
    var aliasFn;
    if(angular.isElement(left)) {
      aliasFn = this.duScrollToElement;
    } else if(angular.isDefined(duration)) {
      aliasFn = this.duScrollToAnimated;
    }
    if(aliasFn) {
      return aliasFn.apply(this, arguments);
    }
    var el = unwrap(this);
    if(isDocument(el)) {
      return $window.scrollTo(left, top);
    }
    el.scrollLeft = left;
    el.scrollTop = top;
  };

  var scrollAnimation, deferred;
  proto.duScrollToAnimated = function(left, top, duration, easing) {
    if(duration && !easing) {
      easing = duScrollEasing;
    }
    var startLeft = this.duScrollLeft(),
        startTop = this.duScrollTop(),
        deltaLeft = Math.round(left - startLeft),
        deltaTop = Math.round(top - startTop);

    var startTime = null, progress = 0;
    var el = this;

    var cancelOnEvents = 'scroll mousedown mousewheel touchmove keydown';
    var cancelScrollAnimation = function($event) {
      if (!$event || (progress && $event.which > 0)) {
        el.unbind(cancelOnEvents, cancelScrollAnimation);
        cancelAnimation(scrollAnimation);
        deferred.reject();
        scrollAnimation = null;
      }
    };

    if(scrollAnimation) {
      cancelScrollAnimation();
    }
    deferred = $q.defer();

    if(duration === 0 || (!deltaLeft && !deltaTop)) {
      if(duration === 0) {
        el.duScrollTo(left, top);
      }
      deferred.resolve();
      return deferred.promise;
    }

    var animationStep = function(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      progress = timestamp - startTime;
      var percent = (progress >= duration ? 1 : easing(progress/duration));

      el.scrollTo(
        startLeft + Math.ceil(deltaLeft * percent),
        startTop + Math.ceil(deltaTop * percent)
      );
      if(percent < 1) {
        scrollAnimation = requestAnimation(animationStep);
      } else {
        el.unbind(cancelOnEvents, cancelScrollAnimation);
        scrollAnimation = null;
        deferred.resolve();
      }
    };

    //Fix random mobile safari bug when scrolling to top by hitting status bar
    el.duScrollTo(startLeft, startTop);

    el.bind(cancelOnEvents, cancelScrollAnimation);

    scrollAnimation = requestAnimation(animationStep);
    return deferred.promise;
  };

  proto.duScrollToElement = function(target, offset, duration, easing) {
    var el = unwrap(this);
    if(!angular.isNumber(offset) || isNaN(offset)) {
      offset = duScrollOffset;
    }
    var top = this.duScrollTop() + unwrap(target).getBoundingClientRect().top - offset;
    if(isElement(el)) {
      top -= el.getBoundingClientRect().top;
    }
    return this.duScrollTo(0, top, duration, easing);
  };

  proto.duScrollLeft = function(value, duration, easing) {
    if(angular.isNumber(value)) {
      return this.duScrollTo(value, this.duScrollTop(), duration, easing);
    }
    var el = unwrap(this);
    if(isDocument(el)) {
      return $window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
    }
    return el.scrollLeft;
  };
  proto.duScrollTop = function(value, duration, easing) {
    if(angular.isNumber(value)) {
      return this.duScrollTo(this.duScrollLeft(), value, duration, easing);
    }
    var el = unwrap(this);
    if(isDocument(el)) {
      return $window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    }
    return el.scrollTop;
  };

  proto.duScrollToElementAnimated = function(target, offset, duration, easing) {
    return this.duScrollToElement(target, offset, duration || duScrollDuration, easing);
  };

  proto.duScrollTopAnimated = function(top, duration, easing) {
    return this.duScrollTop(top, duration || duScrollDuration, easing);
  };

  proto.duScrollLeftAnimated = function(left, duration, easing) {
    return this.duScrollLeft(left, duration || duScrollDuration, easing);
  };

  angular.forEach(proto, function(fn, key) {
    angular.element.prototype[key] = fn;

    //Remove prefix if not already claimed by jQuery / ui.utils
    var unprefixed = key.replace(/^duScroll/, 'scroll');
    if(angular.isUndefined(angular.element.prototype[unprefixed])) {
      angular.element.prototype[unprefixed] = fn;
    }
  });

}]);


//Adapted from https://gist.github.com/paulirish/1579671
angular.module('duScroll.polyfill', [])
.factory('polyfill', ["$window", function($window) {
  'use strict';

  var vendors = ['webkit', 'moz', 'o', 'ms'];

  return function(fnName, fallback) {
    if($window[fnName]) {
      return $window[fnName];
    }
    var suffix = fnName.substr(0, 1).toUpperCase() + fnName.substr(1);
    for(var key, i = 0; i < vendors.length; i++) {
      key = vendors[i]+suffix;
      if($window[key]) {
        return $window[key];
      }
    }
    return fallback;
  };
}]);

angular.module('duScroll.requestAnimation', ['duScroll.polyfill'])
.factory('requestAnimation', ["polyfill", "$timeout", function(polyfill, $timeout) {
  'use strict';

  var lastTime = 0;
  var fallback = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = $timeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  return polyfill('requestAnimationFrame', fallback);
}])
.factory('cancelAnimation', ["polyfill", "$timeout", function(polyfill, $timeout) {
  'use strict';

  var fallback = function(promise) {
    $timeout.cancel(promise);
  };

  return polyfill('cancelAnimationFrame', fallback);
}]);


angular.module('duScroll.spyAPI', ['duScroll.scrollContainerAPI'])
.factory('spyAPI', ["$rootScope", "$timeout", "$window", "$document", "scrollContainerAPI", "duScrollGreedy", "duScrollSpyWait", function($rootScope, $timeout, $window, $document, scrollContainerAPI, duScrollGreedy, duScrollSpyWait) {
  'use strict';

  var createScrollHandler = function(context) {
    var timer = false, queued = false;
    var handler = function() {
      queued = false;
      var container = context.container,
          containerEl = container[0],
          containerOffset = 0,
          bottomReached;

      if (typeof HTMLElement !== 'undefined' && containerEl instanceof HTMLElement || containerEl.nodeType && containerEl.nodeType === containerEl.ELEMENT_NODE) {
        containerOffset = containerEl.getBoundingClientRect().top;
        bottomReached = Math.round(containerEl.scrollTop + containerEl.clientHeight) >= containerEl.scrollHeight;
      } else {
        bottomReached = Math.round($window.pageYOffset + $window.innerHeight) >= $document[0].body.scrollHeight;
      }
      var compareProperty = (bottomReached ? 'bottom' : 'top');

      var i, currentlyActive, toBeActive, spies, spy, pos;
      spies = context.spies;
      currentlyActive = context.currentlyActive;
      toBeActive = undefined;

      for(i = 0; i < spies.length; i++) {
        spy = spies[i];
        pos = spy.getTargetPosition();
        if (!pos) continue;

        if(bottomReached || (pos.top + spy.offset - containerOffset < 20 && (duScrollGreedy || pos.top*-1 + containerOffset) < pos.height)) {
          //Find the one closest the viewport top or the page bottom if it's reached
          if(!toBeActive || toBeActive[compareProperty] < pos[compareProperty]) {
            toBeActive = {
              spy: spy
            };
            toBeActive[compareProperty] = pos[compareProperty];
          }
        }
      }

      if(toBeActive) {
        toBeActive = toBeActive.spy;
      }
      if(currentlyActive === toBeActive || (duScrollGreedy && !toBeActive)) return;
      if(currentlyActive) {
        currentlyActive.$element.removeClass('active');
        $rootScope.$broadcast('duScrollspy:becameInactive', currentlyActive.$element);
      }
      if(toBeActive) {
        toBeActive.$element.addClass('active');
        $rootScope.$broadcast('duScrollspy:becameActive', toBeActive.$element);
      }
      context.currentlyActive = toBeActive;
    };

    if(!duScrollSpyWait) {
      return handler;
    }

    //Debounce for potential performance savings
    return function() {
      if(!timer) {
        handler();
        timer = $timeout(function() {
          timer = false;
          if(queued) {
            handler();
          }
        }, duScrollSpyWait, false);
      } else {
        queued = true;
      }
    };
  };

  var contexts = {};

  var createContext = function($scope) {
    var id = $scope.$id;
    var context = {
      spies: []
    };

    context.handler = createScrollHandler(context);
    contexts[id] = context;

    $scope.$on('$destroy', function() {
      destroyContext($scope);
    });

    return id;
  };

  var destroyContext = function($scope) {
    var id = $scope.$id;
    var context = contexts[id], container = context.container;
    if(container) {
      container.off('scroll', context.handler);
    }
    delete contexts[id];
  };

  var defaultContextId = createContext($rootScope);

  var getContextForScope = function(scope) {
    if(contexts[scope.$id]) {
      return contexts[scope.$id];
    }
    if(scope.$parent) {
      return getContextForScope(scope.$parent);
    }
    return contexts[defaultContextId];
  };

  var getContextForSpy = function(spy) {
    var context, contextId, scope = spy.$scope;
    if(scope) {
      return getContextForScope(scope);
    }
    //No scope, most likely destroyed
    for(contextId in contexts) {
      context = contexts[contextId];
      if(context.spies.indexOf(spy) !== -1) {
        return context;
      }
    }
  };

  var isElementInDocument = function(element) {
    while (element.parentNode) {
      element = element.parentNode;
      if (element === document) {
        return true;
      }
    }
    return false;
  };

  var addSpy = function(spy) {
    var context = getContextForSpy(spy);
    if (!context) return;
    context.spies.push(spy);
    if (!context.container || !isElementInDocument(context.container)) {
      if(context.container) {
        context.container.off('scroll', context.handler);
      }
      context.container = scrollContainerAPI.getContainer(spy.$scope);
      context.container.on('scroll', context.handler).triggerHandler('scroll');
    }
  };

  var removeSpy = function(spy) {
    var context = getContextForSpy(spy);
    if(spy === context.currentlyActive) {
      context.currentlyActive = null;
    }
    var i = context.spies.indexOf(spy);
    if(i !== -1) {
      context.spies.splice(i, 1);
    }
		spy.$element = null;
  };

  return {
    addSpy: addSpy,
    removeSpy: removeSpy,
    createContext: createContext,
    destroyContext: destroyContext,
    getContextForScope: getContextForScope
  };
}]);


angular.module('duScroll.scrollContainerAPI', [])
.factory('scrollContainerAPI', ["$document", function($document) {
  'use strict';

  var containers = {};

  var setContainer = function(scope, element) {
    var id = scope.$id;
    containers[id] = element;
    return id;
  };

  var getContainerId = function(scope) {
    if(containers[scope.$id]) {
      return scope.$id;
    }
    if(scope.$parent) {
      return getContainerId(scope.$parent);
    }
    return;
  };

  var getContainer = function(scope) {
    var id = getContainerId(scope);
    return id ? containers[id] : $document;
  };

  var removeContainer = function(scope) {
    var id = getContainerId(scope);
    if(id) {
      delete containers[id];
    }
  };

  return {
    getContainerId:   getContainerId,
    getContainer:     getContainer,
    setContainer:     setContainer,
    removeContainer:  removeContainer
  };
}]);


angular.module('duScroll.smoothScroll', ['duScroll.scrollHelpers', 'duScroll.scrollContainerAPI'])
.directive('duSmoothScroll', ["duScrollDuration", "duScrollOffset", "scrollContainerAPI", function(duScrollDuration, duScrollOffset, scrollContainerAPI) {
  'use strict';

  return {
    link : function($scope, $element, $attr) {
      $element.on('click', function(e) {
        if(!$attr.href || $attr.href.indexOf('#') === -1) return;

        var target = document.getElementById($attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1));
        if(!target || !target.getBoundingClientRect) return;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        var offset    = $attr.offset ? parseInt($attr.offset, 10) : duScrollOffset;
        var duration  = $attr.duration ? parseInt($attr.duration, 10) : duScrollDuration;
        var container = scrollContainerAPI.getContainer($scope);

        container.duScrollToElement(
          angular.element(target),
          isNaN(offset) ? 0 : offset,
          isNaN(duration) ? 0 : duration
        );
      });
    }
  };
}]);


angular.module('duScroll.spyContext', ['duScroll.spyAPI'])
.directive('duSpyContext', ["spyAPI", function(spyAPI) {
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          spyAPI.createContext($scope);
        }
      };
    }
  };
}]);


angular.module('duScroll.scrollContainer', ['duScroll.scrollContainerAPI'])
.directive('duScrollContainer', ["scrollContainerAPI", function(scrollContainerAPI){
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          iAttrs.$observe('duScrollContainer', function(element) {
            if(angular.isString(element)) {
              element = document.getElementById(element);
            }

            element = (angular.isElement(element) ? angular.element(element) : iElement);
            scrollContainerAPI.setContainer($scope, element);
            $scope.$on('$destroy', function() {
              scrollContainerAPI.removeContainer($scope);
            });
          });
        }
      };
    }
  };
}]);


angular.module('duScroll.scrollspy', ['duScroll.spyAPI'])
.directive('duScrollspy', ["spyAPI", "duScrollOffset", "$timeout", "$rootScope", function(spyAPI, duScrollOffset, $timeout, $rootScope) {
  'use strict';

  var Spy = function(targetElementOrId, $scope, $element, offset) {
    if(angular.isElement(targetElementOrId)) {
      this.target = targetElementOrId;
    } else if(angular.isString(targetElementOrId)) {
      this.targetId = targetElementOrId;
    }
    this.$scope = $scope;
    this.$element = $element;
    this.offset = offset;
  };

  Spy.prototype.getTargetElement = function() {
    if (!this.target && this.targetId) {
      this.target = document.getElementById(this.targetId);
    }
    return this.target;
  };

  Spy.prototype.getTargetPosition = function() {
    var target = this.getTargetElement();
    if(target) {
      return target.getBoundingClientRect();
    }
  };

  Spy.prototype.flushTargetCache = function() {
    if(this.targetId) {
      this.target = undefined;
    }
  };

  return {
    link: function ($scope, $element, $attr) {
      var href = $attr.ngHref || $attr.href;
      var targetId;

      if (href && href.indexOf('#') !== -1) {
        targetId = href.replace(/.*(?=#[^\s]+$)/, '').substring(1);
      } else if($attr.duScrollspy) {
        targetId = $attr.duScrollspy;
      }
      if(!targetId) return;

      // Run this in the next execution loop so that the scroll context has a chance
      // to initialize
      $timeout(function() {
        var spy = new Spy(targetId, $scope, $element, -($attr.offset ? parseInt($attr.offset, 10) : duScrollOffset));
        spyAPI.addSpy(spy);

        $scope.$on('$destroy', function() {
          spyAPI.removeSpy(spy);
        });
        $scope.$on('$locationChangeSuccess', spy.flushTargetCache.bind(spy));
        $rootScope.$on('$stateChangeSuccess', spy.flushTargetCache.bind(spy));
      }, 0, false);
    }
  };
}]);

/*! 
 * angular-loading-bar v0.6.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2014 Wes Cruver
 * License: MIT
 */
/*
 * angular-loading-bar
 *
 * intercepts XHR requests and creates a loading bar.
 * Based on the excellent nprogress work by rstacruz (more info in readme)
 *
 * (c) 2013 Wes Cruver
 * License: MIT
 */


(function() {

'use strict';

// Alias the loading bar for various backwards compatibilities since the project has matured:
angular.module('angular-loading-bar', ['cfp.loadingBarInterceptor']);
angular.module('chieffancypants.loadingBar', ['cfp.loadingBarInterceptor']);


/**
 * loadingBarInterceptor service
 *
 * Registers itself as an Angular interceptor and listens for XHR requests.
 */
angular.module('cfp.loadingBarInterceptor', ['cfp.loadingBar'])
  .config(['$httpProvider', function ($httpProvider) {

    var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', 'cfpLoadingBar', function ($q, $cacheFactory, $timeout, $rootScope, cfpLoadingBar) {

      /**
       * The total number of requests made
       */
      var reqsTotal = 0;

      /**
       * The number of requests completed (either successfully or not)
       */
      var reqsCompleted = 0;

      /**
       * The amount of time spent fetching before showing the loading bar
       */
      var latencyThreshold = cfpLoadingBar.latencyThreshold;

      /**
       * $timeout handle for latencyThreshold
       */
      var startTimeout;


      /**
       * calls cfpLoadingBar.complete() which removes the
       * loading bar from the DOM.
       */
      function setComplete() {
        $timeout.cancel(startTimeout);
        cfpLoadingBar.complete();
        reqsCompleted = 0;
        reqsTotal = 0;
      }

      /**
       * Determine if the response has already been cached
       * @param  {Object}  config the config option from the request
       * @return {Boolean} retrns true if cached, otherwise false
       */
      function isCached(config) {
        var cache;
        var defaultCache = $cacheFactory.get('$http');
        var defaults = $httpProvider.defaults;

        // Choose the proper cache source. Borrowed from angular: $http service
        if ((config.cache || defaults.cache) && config.cache !== false &&
          (config.method === 'GET' || config.method === 'JSONP')) {
            cache = angular.isObject(config.cache) ? config.cache
              : angular.isObject(defaults.cache) ? defaults.cache
              : defaultCache;
        }

        var cached = cache !== undefined ?
          cache.get(config.url) !== undefined : false;

        if (config.cached !== undefined && cached !== config.cached) {
          return config.cached;
        }
        config.cached = cached;
        return cached;
      }


      return {
        'request': function(config) {
          // Check to make sure this request hasn't already been cached and that
          // the requester didn't explicitly ask us to ignore this request:
          if (!config.ignoreLoadingBar && !isCached(config)) {
            $rootScope.$broadcast('cfpLoadingBar:loading', {url: config.url});
            if (reqsTotal === 0) {
              startTimeout = $timeout(function() {
                cfpLoadingBar.start();
              }, latencyThreshold);
            }
            reqsTotal++;
            cfpLoadingBar.set(reqsCompleted / reqsTotal);
          }
          return config;
        },

        'response': function(response) {
          if (!response.config.ignoreLoadingBar && !isCached(response.config)) {
            reqsCompleted++;
            $rootScope.$broadcast('cfpLoadingBar:loaded', {url: response.config.url});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              cfpLoadingBar.set(reqsCompleted / reqsTotal);
            }
          }
          return response;
        },

        'responseError': function(rejection) {
          if (!rejection.config.ignoreLoadingBar && !isCached(rejection.config)) {
            reqsCompleted++;
            $rootScope.$broadcast('cfpLoadingBar:loaded', {url: rejection.config.url});
            if (reqsCompleted >= reqsTotal) {
              setComplete();
            } else {
              cfpLoadingBar.set(reqsCompleted / reqsTotal);
            }
          }
          return $q.reject(rejection);
        }
      };
    }];

    $httpProvider.interceptors.push(interceptor);
  }]);


/**
 * Loading Bar
 *
 * This service handles adding and removing the actual element in the DOM.
 * Generally, best practices for DOM manipulation is to take place in a
 * directive, but because the element itself is injected in the DOM only upon
 * XHR requests, and it's likely needed on every view, the best option is to
 * use a service.
 */
angular.module('cfp.loadingBar', [])
  .provider('cfpLoadingBar', function() {

    this.includeSpinner = true;
    this.includeBar = true;
    this.latencyThreshold = 100;
    this.startSize = 0.02;
    this.parentSelector = 'body';
    this.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>';
    this.loadingBarTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>';

    this.$get = ['$injector', '$document', '$timeout', '$rootScope', function ($injector, $document, $timeout, $rootScope) {
      var $animate;
      var $parentSelector = this.parentSelector,
        loadingBarContainer = angular.element(this.loadingBarTemplate),
        loadingBar = loadingBarContainer.find('div').eq(0),
        spinner = angular.element(this.spinnerTemplate);

      var incTimeout,
        completeTimeout,
        started = false,
        status = 0;

      var includeSpinner = this.includeSpinner;
      var includeBar = this.includeBar;
      var startSize = this.startSize;

      /**
       * Inserts the loading bar element into the dom, and sets it to 2%
       */
      function _start() {
        if (!$animate) {
          $animate = $injector.get('$animate');
        }

        var $parent = $document.find($parentSelector).eq(0);
        $timeout.cancel(completeTimeout);

        // do not continually broadcast the started event:
        if (started) {
          return;
        }

        $rootScope.$broadcast('cfpLoadingBar:started');
        started = true;

        if (includeBar) {
          $animate.enter(loadingBarContainer, $parent);
        }

        if (includeSpinner) {
          $animate.enter(spinner, $parent);
        }

        _set(startSize);
      }

      /**
       * Set the loading bar's width to a certain percent.
       *
       * @param n any value between 0 and 1
       */
      function _set(n) {
        if (!started) {
          return;
        }
        var pct = (n * 100) + '%';
        loadingBar.css('width', pct);
        status = n;

        // increment loadingbar to give the illusion that there is always
        // progress but make sure to cancel the previous timeouts so we don't
        // have multiple incs running at the same time.
        $timeout.cancel(incTimeout);
        incTimeout = $timeout(function() {
          _inc();
        }, 250);
      }

      /**
       * Increments the loading bar by a random amount
       * but slows down as it progresses
       */
      function _inc() {
        if (_status() >= 1) {
          return;
        }

        var rnd = 0;

        // TODO: do this mathmatically instead of through conditions

        var stat = _status();
        if (stat >= 0 && stat < 0.25) {
          // Start out between 3 - 6% increments
          rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
        } else if (stat >= 0.25 && stat < 0.65) {
          // increment between 0 - 3%
          rnd = (Math.random() * 3) / 100;
        } else if (stat >= 0.65 && stat < 0.9) {
          // increment between 0 - 2%
          rnd = (Math.random() * 2) / 100;
        } else if (stat >= 0.9 && stat < 0.99) {
          // finally, increment it .5 %
          rnd = 0.005;
        } else {
          // after 99%, don't increment:
          rnd = 0;
        }

        var pct = _status() + rnd;
        _set(pct);
      }

      function _status() {
        return status;
      }

      function _completeAnimation() {
        status = 0;
        started = false;
      }

      function _complete() {
        if (!$animate) {
          $animate = $injector.get('$animate');
        }

        $rootScope.$broadcast('cfpLoadingBar:completed');
        _set(1);

        $timeout.cancel(completeTimeout);

        // Attempt to aggregate any start/complete calls within 500ms:
        completeTimeout = $timeout(function() {
          var promise = $animate.leave(loadingBarContainer, _completeAnimation);
          if (promise && promise.then) {
            promise.then(_completeAnimation);
          }
          $animate.leave(spinner);
        }, 500);
      }

      return {
        start            : _start,
        set              : _set,
        status           : _status,
        inc              : _inc,
        complete         : _complete,
        includeSpinner   : this.includeSpinner,
        latencyThreshold : this.latencyThreshold,
        parentSelector   : this.parentSelector,
        startSize        : this.startSize
      };


    }];     //
  });       // wtf javascript. srsly
})();       //

'use strict';
(function(angular){
/* global _ */
var Module = angular.module('datePicker', []);

Module.constant('datePickerConfig', {
  template: 'templates/datepicker.html',
  view: 'month',
  views: ['year', 'month', 'date', 'hours', 'minutes'],
  step: 5
});

Module.filter('time', function () {
  function format(date) {
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  return function (date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
      if (isNaN(date.getTime())) {
        return undefined;
      }
    }
    return format(date);
  };
});

Module.directive('datePicker', ['datePickerConfig', 'datePickerUtils', function datePickerDirective(datePickerConfig, datePickerUtils) {

  //noinspection JSUnusedLocalSymbols
  return {
    // this is a bug ?
    require: '?ngModel',
    template: '<div ng-include="template"></div>',
    scope: {
      model: '=datePicker',
      after: '=?',
      before: '=?'
    },
    link: function (scope, element, attrs, ngModel) {

      var arrowClick = false;

      scope.date = new Date(scope.model || new Date());
      scope.views = datePickerConfig.views.concat();
      scope.view = attrs.view || datePickerConfig.view;
      scope.now = new Date();
      scope.template = attrs.template || datePickerConfig.template;
      scope.watchDirectChanges = attrs.watchDirectChanges !== undefined;
      scope.callbackOnSetDate = attrs.onSetDate ? _.get(scope.$parent, attrs.onSetDate) : undefined;

      var step = parseInt(attrs.step || datePickerConfig.step, 10);
      var partial = !!attrs.partial;

      //if ngModel, we can add min and max validators
      if (ngModel) {
        if (angular.isDefined(attrs.minDate)) {
          var minVal;
          ngModel.$validators.min = function (value) {
            return !datePickerUtils.isValidDate(value) || angular.isUndefined(minVal) || value >= minVal;
          };
          attrs.$observe('minDate', function (val) {
            minVal = new Date(val);
            ngModel.$validate();
          });
        }

        if (angular.isDefined(attrs.maxDate)) {
          var maxVal;
          ngModel.$validators.max = function (value) {
            return !datePickerUtils.isValidDate(value) || angular.isUndefined(maxVal) || value <= maxVal;
          };
          attrs.$observe('maxDate', function (val) {
            maxVal = new Date(val);
            ngModel.$validate();
          });
        }
      }
      //end min, max date validator

      /** @namespace attrs.minView, attrs.maxView */
      scope.views = scope.views.slice(
        scope.views.indexOf(attrs.maxView || 'year'),
        scope.views.indexOf(attrs.minView || 'minutes') + 1
      );

      if (scope.views.length === 1 || scope.views.indexOf(scope.view) === -1) {
        scope.view = scope.views[0];
      }

      scope.setView = function (nextView) {
        if (scope.views.indexOf(nextView) !== -1) {
          scope.view = nextView;
        }
      };

      scope.setDate = function (date) {
        if (attrs.disabled) {
          return;
        }
        scope.date = date;
        // change next view
        var nextView = scope.views[scope.views.indexOf(scope.view) + 1];
        if ((!nextView || partial) || scope.model) {

          scope.model = new Date(scope.model || date);
          //if ngModel , setViewValue and trigger ng-change, etc...
          if (ngModel) {
            ngModel.$setViewValue(scope.date);
          }

          var view = partial ? 'minutes' : scope.view;
          //noinspection FallThroughInSwitchStatementJS
          switch (view) {
            case 'minutes':
              scope.model.setMinutes(date.getMinutes());
            /*falls through*/
            case 'hours':
              scope.model.setHours(date.getHours());
            /*falls through*/
            case 'date':
              scope.model.setFullYear(date.getFullYear());
              scope.model.setMonth(date.getMonth());
              scope.model.setDate(date.getDate());
              break;
            /*break cause it can switch the date to incorrect date e.g. set 31 for September */
            case 'month':
              scope.model.setMonth(date.getMonth());
            /*falls through*/
            case 'year':
              scope.model.setFullYear(date.getFullYear());
          }

          if (!nextView && scope.model) {
            scope.$emit('setMaxDate', attrs.datePicker, scope.model, scope.view);

            if (scope.callbackOnSetDate) {
              scope.callbackOnSetDate();
            }

          }

          scope.$emit('setDate', scope.model, scope.view);
        }

        if (nextView) {
          scope.setView(nextView);
        }

        if (!nextView && attrs.autoClose === 'true') {
          element.addClass('hidden');
          scope.$emit('hidePicker');
        }
      };

      function update() {
        var view = scope.view;

        if (scope.model && !arrowClick) {
          scope.date = new Date(scope.model);
          arrowClick = false;
        }
        var date = scope.date;

        switch (view) {
          case 'year':
            scope.years = datePickerUtils.getVisibleYears(date);
            break;
          case 'month':
            scope.months = datePickerUtils.getVisibleMonths(date);
            break;
          case 'date':
            scope.weekdays = scope.weekdays || datePickerUtils.getDaysOfWeek();
            scope.weeks = datePickerUtils.getVisibleWeeks(date);
            break;
          case 'hours':
            scope.hours = datePickerUtils.getVisibleHours(date);
            break;
          case 'minutes':
            scope.minutes = datePickerUtils.getVisibleMinutes(date, step);
            break;
        }
      }

      function watch() {
        if (scope.view !== 'date') {
          return scope.view;
        }
        return scope.date ? scope.date.getMonth() : null;
      }


      scope.$watch(watch, update);

      if (scope.watchDirectChanges) {
        scope.$watch('model', function () {
          arrowClick = false;
          update();
        });
      }

      scope.next = function (delta) {
        var date = scope.date;
        delta = delta || 1;
        switch (scope.view) {
          case 'year':
          /*falls through*/
          case 'month':
            date.setFullYear(date.getFullYear() + delta);
            break;
          case 'date':
            /* Reverting from ISSUE #113
             var dt = new Date(date);
             date.setMonth(date.getMonth() + delta);
             if (date.getDate() < dt.getDate()) {
             date.setDate(0);
             }
             */
            date.setMonth(date.getMonth() + delta);
            break;
          case 'hours':
          /*falls through*/
          case 'minutes':
            date.setHours(date.getHours() + delta);
            break;
        }
        arrowClick = true;
        update();
      };

      scope.prev = function (delta) {
        return scope.next(-delta || -1);
      };

      scope.isAfter = function (date) {
        return scope.after && datePickerUtils.isAfter(date, scope.after);
      };

      scope.isBefore = function (date) {
        return scope.before && datePickerUtils.isBefore(date, scope.before);
      };

      scope.isSameMonth = function (date) {
        return datePickerUtils.isSameMonth(scope.model, date);
      };

      scope.isSameYear = function (date) {
        return datePickerUtils.isSameYear(scope.model, date);
      };

      scope.isSameDay = function (date) {
        return datePickerUtils.isSameDay(scope.model, date);
      };

      scope.isSameHour = function (date) {
        return datePickerUtils.isSameHour(scope.model, date);
      };

      scope.isSameMinutes = function (date) {
        return datePickerUtils.isSameMinutes(scope.model, date);
      };

      scope.isNow = function (date) {
        var is = true;
        var now = scope.now;
        //noinspection FallThroughInSwitchStatementJS
        switch (scope.view) {
          case 'minutes':
            is &= ~~(date.getMinutes() / step) === ~~(now.getMinutes() / step);
          /*falls through*/
          case 'hours':
            is &= date.getHours() === now.getHours();
          /*falls through*/
          case 'date':
            is &= date.getDate() === now.getDate();
          /*falls through*/
          case 'month':
            is &= date.getMonth() === now.getMonth();
          /*falls through*/
          case 'year':
            is &= date.getFullYear() === now.getFullYear();
        }
        return is;
      };
    }
  };
}]);

angular.module('datePicker').factory('datePickerUtils', function(){
  var createNewDate = function(year, month, day, hour, minute) {
    // without any arguments, the default date will be 1899-12-31T00:00:00.000Z
    return new Date(year | 0, month | 0, day | 0, hour | 0, minute | 0);
  };
  return {
    getVisibleMinutes : function(date, step) {
      date = new Date(date || new Date());
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hour = date.getHours();
      var minutes = [];
      var minute, pushedDate;
      for (minute = 0 ; minute < 60 ; minute += step) {
        pushedDate = createNewDate(year, month, day, hour, minute);
        minutes.push(pushedDate);
      }
      return minutes;
    },
    getVisibleWeeks : function(date) {
      date = new Date(date || new Date());
      var startMonth = date.getMonth();
      var startYear = date.getYear();
      // set date to start of the week
      date.setDate(1);

      if (date.getDay() === 0) {
        // day is sunday, let's get back to the previous week
        date.setDate(-5);
      } else {
        // day is not sunday, let's get back to the start of the week
        date.setDate(date.getDate() - (date.getDay() - 1));
      }
      if (date.getDate() === 1) {
        // day is monday, let's get back to the previous week
        date.setDate(-6);
      }

      var weeks = [];
      var week;
      while (weeks.length < 6) {
        if (date.getYear() === startYear && date.getMonth() > startMonth) {
          break;
        }
        week = this.getDaysOfWeek(date);
        weeks.push(week);
        date.setDate(date.getDate() + 7);
      }
      return weeks;
    },
    getVisibleYears : function(date) {
      date = new Date(date || new Date());
      date.setFullYear(date.getFullYear() - (date.getFullYear() % 10));
      var year = date.getFullYear();
      var years = [];
      var pushedDate;
      for (var i = 0; i < 12; i++) {
        pushedDate = createNewDate(year);
        years.push(pushedDate);
        year++;
      }
      return years;
    },
    getDaysOfWeek : function(date) {
      date = new Date(date || new Date());
      date.setDate(date.getDate() - (date.getDay() - 1));
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var days = [];
      var pushedDate;
      for (var i = 0; i < 7; i++) {
        pushedDate = createNewDate(year, month, day);
        days.push(pushedDate);
        day++;
      }
      return days;
    },
    getVisibleMonths : function(date) {
      date = new Date(date || new Date());
      var year = date.getFullYear();
      var months = [];
      var pushedDate;
      for (var month = 0; month < 12; month++) {
        pushedDate = createNewDate(year, month, 1);
        months.push(pushedDate);
      }
      return months;
    },
    getVisibleHours : function(date) {
      date = new Date(date || new Date());
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hours = [];
      var hour, pushedDate;
      for (hour = 0 ; hour < 24 ; hour++) {
        pushedDate = createNewDate(year, month, day, hour);
        hours.push(pushedDate);
      }
      return hours;
    },
    isAfter : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return model && model.getTime() >= date.getTime();
    },
    isBefore : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return model.getTime() <= date.getTime();
    },
    isSameYear :   function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return model && model.getFullYear() === date.getFullYear();
    },
    isSameMonth : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return this.isSameYear(model, date) && model.getMonth() === date.getMonth();
    },
    isSameDay : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return this.isSameMonth(model, date) && model.getDate() === date.getDate();
    },
    isSameHour : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return this.isSameDay(model, date) && model.getHours() === date.getHours();
    },
    isSameMinutes : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return this.isSameHour(model, date) && model.getMinutes() === date.getMinutes();
    },
    isValidDate : function(value) {
      // Invalid Date: getTime() returns NaN
      return value && !(value.getTime && value.getTime() !== value.getTime());
    }
    /*
    toMomentFormat : function(angularFormat) {
        function replaceAll(find, replace, string) {
          return string.replace(new RegExp(find, 'g'), replace);
        }

        var momentFormat = angularFormat;
        momentFormat = replaceAll('y', 'Y', momentFormat);
        momentFormat = replaceAll('d', 'D', momentFormat);
        momentFormat = replaceAll('E', 'd', momentFormat);
        momentFormat = replaceAll('sss', 'SSS', momentFormat);
        momentFormat = replaceAll('w', 'W', momentFormat);
        return momentFormat;
      }
      */
  };
});

var Module = angular.module('datePicker');

Module.directive('dateRange', function () {
  return {
    templateUrl: 'templates/daterange.html',
    scope: {
      start: '=',
      end: '='
    },
    link: function (scope, element, attrs) {

      /*
       * If no date is set on scope, set current date from user system
       */
      scope.start = new Date(scope.start || new Date());
      scope.end = new Date(scope.end || new Date());

      attrs.$observe('disabled', function(isDisabled){
          scope.disableDatePickers = !!isDisabled;
        });
      scope.$watch('start.getTime()', function (value) {
        if (value && scope.end && value > scope.end.getTime()) {
          scope.end = new Date(value);
        }
      });
      scope.$watch('end.getTime()', function (value) {
        if (value && scope.start && value < scope.start.getTime()) {
          scope.start = new Date(value);
        }
      });
    }
  };
});

var PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty';

var Module = angular.module('datePicker');

Module.constant('dateTimeConfig', {
  template: function (attrs) {
    return '' +
        '<div ' +
        'date-picker="' + attrs.ngModel + '" ' +
        (attrs.view ? 'view="' + attrs.view + '" ' : '') +
        (attrs.maxView ? 'max-view="' + attrs.maxView + '" ' : '') +
        (attrs.autoClose ? 'auto-close="' + attrs.autoClose + '" ' : '') +
        (attrs.template ? 'template="' + attrs.template + '" ' : '') +
        (attrs.minView ? 'min-view="' + attrs.minView + '" ' : '') +
        (attrs.partial ? 'partial="' + attrs.partial + '" ' : '') +
        (attrs.step ? 'step="' + attrs.step + '" ' : '') +
        'class="date-picker-date-time"></div>';
  },
  format: 'yyyy-MM-dd HH:mm',
  views: ['date', 'year', 'month', 'hours', 'minutes'],
  autoClose: false,
  position: 'relative'
});

Module.directive('dateTimeAppend', function () {
  return {
    link: function (scope, element) {
      element.bind('click', function () {
        element.find('input')[0].focus();
      });
    }
  };
});

Module.directive('dateTime', ['$compile', '$document', '$filter', 'dateTimeConfig', '$parse', 'datePickerUtils',
                function ($compile, $document, $filter, dateTimeConfig, $parse, datePickerUtils) {
  var body = $document.find('body');
  var dateFilter = $filter('date');

  return {
    require: 'ngModel',
    scope:true,
    link: function (scope, element, attrs, ngModel) {
      var format = attrs.format || dateTimeConfig.format;
      var parentForm = element.inheritedData('$formController');
      var views = $parse(attrs.views)(scope) || dateTimeConfig.views.concat();
      var view = attrs.view || views[0];
      var index = views.indexOf(view);
      var dismiss = attrs.autoClose ? $parse(attrs.autoClose)(scope) : dateTimeConfig.autoClose;
      var picker = null;
      var position = attrs.position || dateTimeConfig.position;
      var container = null;

      if (index === -1) {
        views.splice(index, 1);
      }

      views.unshift(view);


      function formatter(value) {
        return dateFilter(value, format);
      }

      /*
      function parser(viewValue) {
        if(viewValue.length === format.length) {
          var date = moment(viewValue, datePickerUtils.toMomentFormat(format));
          if(date.isValid()) {
            clear();
            return date.toDate();
          }
          return viewValue;
        }
        return undefined;
      }
      */
      function parser(viewValue) {
        if(viewValue.length === format.length) {
          return viewValue;
        }
        return undefined;
      }

      ngModel.$formatters.push(formatter);
      ngModel.$parsers.unshift(parser);


      //min. max date validators
      if (angular.isDefined(attrs.minDate)) {
        var minVal;
        ngModel.$validators.min = function (value) {
            return !datePickerUtils.isValidDate(value) || angular.isUndefined(minVal) || value >= minVal;
          };
        attrs.$observe('minDate', function (val) {
            minVal = new Date(val);
            ngModel.$validate();
          });
      }

      if (angular.isDefined(attrs.maxDate)) {
        var maxVal;
        ngModel.$validators.max = function (value) {
            return !datePickerUtils.isValidDate(value) || angular.isUndefined(maxVal) || value <= maxVal;
          };
        attrs.$observe('maxDate', function (val) {
            maxVal = new Date(val);
            ngModel.$validate();
          });
      }
      //end min, max date validator

      var template = dateTimeConfig.template(attrs);

      function updateInput(event) {
        event.stopPropagation();
        if (ngModel.$pristine) {
          ngModel.$dirty = true;
          ngModel.$pristine = false;
          element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
          if (parentForm) {
            parentForm.$setDirty();
          }
          ngModel.$render();
        }
      }

      function clear() {
        if (picker) {
          picker.remove();
          picker = null;
        }
        if (container) {
          container.remove();
          container = null;
        }
      }

      function showPicker() {
        if (picker) {
          return;
        }
        // create picker element
        picker = $compile(template)(scope);
        scope.$digest();

        scope.$on('setDate', function (event, date, view) {
          updateInput(event);
          if (dismiss && views[views.length - 1] === view) {
            clear();
          }
        });

        scope.$on('hidePicker', function () {
          element.triggerHandler('blur');
        });

        scope.$on('$destroy', clear);

        // move picker below input element

        if (position === 'absolute') {
          var pos = angular.extend(element.offset(), { height: element[0].offsetHeight });
          picker.css({ top: pos.top + pos.height, left: pos.left, display: 'block', position: position});
          body.append(picker);
        } else {
          // relative
          container = angular.element('<div date-picker-wrapper></div>');
          element[0].parentElement.insertBefore(container[0], element[0]);
          container.append(picker);
//          this approach doesn't work
//          element.before(picker);
          picker.css({top: element[0].offsetHeight + 'px', display: 'block'});
        }

        picker.bind('mousedown', function (evt) {
          evt.preventDefault();
        });
      }

      element.bind('focus', showPicker);
      element.bind('blur', clear);
    }
  };
}]);

angular.module('datePicker').run(['$templateCache', function($templateCache) {
$templateCache.put('templates/datepicker.html',
    "<div ng-switch=\"view\">\r" +
    "\n" +
    "  <div ng-switch-when=\"date\">\r" +
    "\n" +
    "    <table>\r" +
    "\n" +
    "      <thead>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th ng-click=\"prev()\">&lsaquo;</th>\r" +
    "\n" +
    "        <th colspan=\"5\" class=\"switch\" ng-click=\"setView('month')\" ng-bind=\"date|date:'yyyy MMMM'\"></th>\r" +
    "\n" +
    "        <th ng-click=\"next()\">&rsaquo;</i></th>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th ng-repeat=\"day in weekdays\" style=\"overflow: hidden\" ng-bind=\"day|date:'EEE'\"></th>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </thead>\r" +
    "\n" +
    "      <tbody>\r" +
    "\n" +
    "      <tr ng-repeat=\"week in weeks\">\r" +
    "\n" +
    "        <td ng-repeat=\"day in week\">\r" +
    "\n" +
    "          <span\r" +
    "\n" +
    "            ng-class=\"{'now':isNow(day),'active':isSameDay(day),'disabled':(day.getMonth()!=date.getMonth()),'after':isAfter(day),'before':isBefore(day)}\"\r" +
    "\n" +
    "            ng-click=\"setDate(day)\" ng-bind=\"day.getDate()\"></span>\r" +
    "\n" +
    "        </td>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div ng-switch-when=\"year\">\r" +
    "\n" +
    "    <table>\r" +
    "\n" +
    "      <thead>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th ng-click=\"prev(10)\">&lsaquo;</th>\r" +
    "\n" +
    "        <th colspan=\"5\" class=\"switch\"ng-bind=\"years[0].getFullYear()+' - '+years[years.length-1].getFullYear()\"></th>\r" +
    "\n" +
    "        <th ng-click=\"next(10)\">&rsaquo;</i></th>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </thead>\r" +
    "\n" +
    "      <tbody>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <td colspan=\"7\">\r" +
    "\n" +
    "          <span ng-class=\"{'active':isSameYear(year),'now':isNow(year)}\"\r" +
    "\n" +
    "                ng-repeat=\"year in years\"\r" +
    "\n" +
    "                ng-click=\"setDate(year)\" ng-bind=\"year.getFullYear()\"></span>\r" +
    "\n" +
    "        </td>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div ng-switch-when=\"month\">\r" +
    "\n" +
    "    <table>\r" +
    "\n" +
    "      <thead>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th ng-click=\"prev()\">&lsaquo;</th>\r" +
    "\n" +
    "        <th colspan=\"5\" class=\"switch\" ng-click=\"setView('year')\" ng-bind=\"date|date:'yyyy'\"></th>\r" +
    "\n" +
    "        <th ng-click=\"next()\">&rsaquo;</i></th>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </thead>\r" +
    "\n" +
    "      <tbody>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <td colspan=\"7\">\r" +
    "\n" +
    "          <span ng-repeat=\"month in months\"\r" +
    "\n" +
    "                ng-class=\"{'active':isSameMonth(month),'after':isAfter(month),'before':isBefore(month),'now':isNow(month)}\"\r" +
    "\n" +
    "                ng-click=\"setDate(month)\"\r" +
    "\n" +
    "                ng-bind=\"month|date:'MMM'\"></span>\r" +
    "\n" +
    "        </td>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div ng-switch-when=\"hours\">\r" +
    "\n" +
    "    <table>\r" +
    "\n" +
    "      <thead>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th ng-click=\"prev(24)\">&lsaquo;</th>\r" +
    "\n" +
    "        <th colspan=\"5\" class=\"switch\" ng-click=\"setView('date')\" ng-bind=\"date|date:'dd MMMM yyyy'\"></th>\r" +
    "\n" +
    "        <th ng-click=\"next(24)\">&rsaquo;</i></th>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </thead>\r" +
    "\n" +
    "      <tbody>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <td colspan=\"7\">\r" +
    "\n" +
    "          <span ng-repeat=\"hour in hours\"\r" +
    "\n" +
    "                ng-class=\"{'now':isNow(hour),'active':isSameHour(hour)}\"\r" +
    "\n" +
    "                ng-click=\"setDate(hour)\" ng-bind=\"hour|time\"></span>\r" +
    "\n" +
    "        </td>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div ng-switch-when=\"minutes\">\r" +
    "\n" +
    "    <table>\r" +
    "\n" +
    "      <thead>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th ng-click=\"prev()\">&lsaquo;</th>\r" +
    "\n" +
    "        <th colspan=\"5\" class=\"switch\" ng-click=\"setView('hours')\" ng-bind=\"date|date:'dd MMMM yyyy'\"></th>\r" +
    "\n" +
    "        <th ng-click=\"next()\">&rsaquo;</i></th>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </thead>\r" +
    "\n" +
    "      <tbody>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <td colspan=\"7\">\r" +
    "\n" +
    "          <span ng-repeat=\"minute in minutes\"\r" +
    "\n" +
    "                ng-class=\"{active:isSameMinutes(minute),'now':isNow(minute)}\"\r" +
    "\n" +
    "                ng-click=\"setDate(minute)\"\r" +
    "\n" +
    "                ng-bind=\"minute|time\"></span>\r" +
    "\n" +
    "        </td>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "      </tbody>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('templates/daterange.html',
    "<div>\r" +
    "\n" +
    "    <table>\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <td valign=\"top\">\r" +
    "\n" +
    "                <div date-picker=\"start\" ng-disabled=\"disableDatePickers\"  class=\"date-picker\" date after=\"start\" before=\"end\" min-view=\"date\" max-view=\"date\"></div>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "            <td valign=\"top\">\r" +
    "\n" +
    "                <div date-picker=\"end\" ng-disabled=\"disableDatePickers\"  class=\"date-picker\" date after=\"start\" before=\"end\"  min-view=\"date\" max-view=\"date\"></div>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "    </table>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
})(angular);
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.StringMask = factory();
	}
}(this, function () {
	var tokens = {
		'0': {pattern: /\d/, _default: '0'},
		'9': {pattern: /\d/, optional: true},
		'#': {pattern: /\d/, optional: true, recursive: true},
		'S': {pattern: /[a-zA-Z]/},
		'U': {pattern: /[a-zA-Z]/, transform: function (c) { return c.toLocaleUpperCase(); }},
		'L': {pattern: /[a-zA-Z]/, transform: function (c) { return c.toLocaleLowerCase(); }},
		'$': {escape: true}
	};

	function isEscaped(pattern, pos) {
		var count = 0;
		var i = pos - 1;
		var token = {escape: true};
		while (i >= 0 && token && token.escape) {
			token = tokens[pattern.charAt(i)];
			count += token && token.escape ? 1 : 0;
			i--;
		}
		return count > 0 && count%2 === 1;
	}

	function calcOptionalNumbersToUse(pattern, value) {
		var numbersInP = pattern.replace(/[^0]/g,'').length;
		var numbersInV = value.replace(/[^\d]/g,'').length;
		return numbersInV - numbersInP;
	}

	function concatChar(text, character, options, token) {
		if (token && typeof token.transform === 'function') character = token.transform(character);
		if (options.reverse) return character + text;
		return text + character;
	}

	function hasMoreTokens(pattern, pos, inc) {
		var pc = pattern.charAt(pos);
		var token = tokens[pc];
		if (pc === '') return false;
		return token && !token.escape ? true : hasMoreTokens(pattern, pos + inc, inc);
	}

	function insertChar(text, char, position) {
		var t = text.split('');
		t.splice(position >= 0 ? position: 0, 0, char);
		return t.join('');
	}

	function StringMask(pattern, opt) {
		this.options = opt || {};
		this.options = {
			reverse: this.options.reverse || false,
			usedefaults: this.options.usedefaults || this.options.reverse
		};
		this.pattern = pattern;
	}

	StringMask.prototype.process = function proccess(value) {
		if (!value) {
			return {result: '', valid: false};
		}
		value = value + '';
		var pattern2 = this.pattern;
		var valid = true;
		var formatted = '';
		var valuePos = this.options.reverse ? value.length - 1 : 0;
		var optionalNumbersToUse = calcOptionalNumbersToUse(pattern2, value);
		var escapeNext = false;
		var recursive = [];
		var inRecursiveMode = false;

		var steps = {
			start: this.options.reverse ? pattern2.length - 1 : 0,
			end: this.options.reverse ? -1 : pattern2.length,
			inc: this.options.reverse ? -1 : 1
		};

		function continueCondition(options) {
			if (!inRecursiveMode && hasMoreTokens(pattern2, i, steps.inc)) {
				return true;
			} else if (!inRecursiveMode) {
				inRecursiveMode = recursive.length > 0;
			}

			if (inRecursiveMode) {
				var pc = recursive.shift();
				recursive.push(pc);
				if (options.reverse && valuePos >= 0) {
					i++;
					pattern2 = insertChar(pattern2, pc, i);
					return true;
				} else if (!options.reverse && valuePos < value.length) {
					pattern2 = insertChar(pattern2, pc, i);
					return true;
				}
			}
			return i < pattern2.length && i >= 0;
		}

		for (var i = steps.start; continueCondition(this.options); i = i + steps.inc) {
			var pc = pattern2.charAt(i);
			var vc = value.charAt(valuePos);
			var token = tokens[pc];
			if (!inRecursiveMode || vc) {
				if (this.options.reverse && isEscaped(pattern2, i)) {
					formatted = concatChar(formatted, pc, this.options, token);
					i = i + steps.inc;
					continue;
				} else if (!this.options.reverse && escapeNext) {
					formatted = concatChar(formatted, pc, this.options, token);
					escapeNext = false;
					continue;
				} else if (!this.options.reverse && token && token.escape) {
					escapeNext = true;
					continue;
				}
			}

			if (!inRecursiveMode && token && token.recursive) {
				recursive.push(pc);
			} else if (inRecursiveMode && !vc) {
				if (!token || !token.recursive) formatted = concatChar(formatted, pc, this.options, token);
				continue;
			} else if (recursive.length > 0 && token && !token.recursive) {
				// Recursive tokens most be the last tokens of the pattern
				valid = false;
				continue;
			} else if (!inRecursiveMode && recursive.length > 0 && !vc) {
				continue;
			}

			if (!token) {
				formatted = concatChar(formatted, pc, this.options, token);
				if (!inRecursiveMode && recursive.length) {
					recursive.push(pc);
				}
			} else if (token.optional) {
				if (token.pattern.test(vc) && optionalNumbersToUse) {
					formatted = concatChar(formatted, vc, this.options, token);
					valuePos = valuePos + steps.inc;
					optionalNumbersToUse--;
				} else if (recursive.length > 0 && vc) {
					valid = false;
					break;
				}
			} else if (token.pattern.test(vc)) {
				formatted = concatChar(formatted, vc, this.options, token);
				valuePos = valuePos + steps.inc;
			} else if (!vc && token._default && this.options.usedefaults) {
				formatted = concatChar(formatted, token._default, this.options, token);
			} else {
				valid = false;
				break;
			}
		}

		return {result: formatted, valid: valid};
	};

	StringMask.prototype.apply = function(value) {
		return this.process(value).result;
	};

	StringMask.prototype.validate = function(value) {
		return this.process(value).valid;
	};

	StringMask.process = function(value, pattern, options) {
		return new StringMask(pattern, options).process(value);
	};

	StringMask.apply = function(value, pattern, options) {
		return new StringMask(pattern, options).apply(value);
	};

	StringMask.validate = function(value, pattern, options) {
		return new StringMask(pattern, options).validate(value);
	};

	return StringMask;
}));
