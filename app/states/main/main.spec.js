describe('On MainController', function() {

  var controller, MainController, $scope = {};

  var Configuration = {
    getAppName: function () {
      return 'Fruit Salad';
    },
    getEntities: function () {
      return [
        { name: 'banana', label: 'Banana' },
        { name: 'apple', label: 'Apple'  },
        { name: 'orange', label: 'Orange' },
        { name: 'bacon', label: 'Bacon' }
      ];
    }
  };

  beforeEach(function () {
    module('carnival');
    inject(function($controller){
      controller = $controller;
    });
    MainController = controller('MainController', {
      $scope: $scope,
      Configuration: Configuration
    });
  });

  it('should fill the scope with the app name', function() {
    expect($scope.app_name).to.be.equal('Fruit Salad');
  });

  it('should fill the scope with the menu items', function () {
    expect($scope.menu_items.length).to.be.equal(4);
  });

});
