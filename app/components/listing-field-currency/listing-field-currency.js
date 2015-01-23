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

        var decimalDelimiter   = scope.field.currencyOptions.decimalDelimiter || '.',
            thousandsDelimiter = scope.field.currencyOptions.thousandsDelimiter || '',
            currencySym        = scope.field.currencyOptions.symbol || '$',
            decimals           = parseInt(scope.field.currencyOptions.decimals, 10);

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
