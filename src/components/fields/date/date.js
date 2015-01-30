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
