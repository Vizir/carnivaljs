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
    controller: function($scope, $stateParams, Configuration, $injector){

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
    }
  };
});
