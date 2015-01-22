angular.module('carnival.components.fields.currency', [])
.directive('carnivalCurrencyField', function ($filter) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      field: '='
    },
    templateUrl: 'components/fields/currency/currency.html'
  };
})
.directive('currency', function ($parse) {
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

      var decimalDelimiter   = scope.field.currencyOptions.decimalDelimiter || '.',
          thousandsDelimiter = scope.field.currencyOptions.thousandsDelimiter || '',
          currencySym        = scope.field.currencyOptions.symbol || '$',
          decimals           = parseInt(attrs.currency, 10);

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
          return value;
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
});
