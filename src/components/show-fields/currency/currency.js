angular.module('carnival.components.showCurrency', [])
.directive('carnivalShowCurrency', function ($filter) {
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
});

