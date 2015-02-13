angular.module('carnival.components.form-fields', [])
.directive('carnivalFormFields', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      field: '='
    },
    templateUrl: 'components/form-fields/form-fields.html',
    link: function (scope) {
      scope.canShow = scope.$parent.canShow;
      scope.datas   = scope.$parent.datas;
      scope.nestedFormIndex = scope.$parent.nestedFormIndex;
      scope.entity  = scope.$parent.entity;
      scope.state   = scope.$parent.state;
    }
  };
});
