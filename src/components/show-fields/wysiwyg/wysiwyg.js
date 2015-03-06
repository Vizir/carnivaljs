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
