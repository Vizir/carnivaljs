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
