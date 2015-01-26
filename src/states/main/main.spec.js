describe('On MainController', function() {

  var controller, MainController, $scope = {};

  var Configuration = {
    getAppName: function () {
      return 'Fruit Salad';
    },
    getNavbarItems: function () {
      return [
        { label: 'Banana', link: { type: 'entity', url: 'banana' } },
        { label: 'Apple',  link: { type: 'entity', url: 'apple' } },
        { label: 'Orange', link: { type: 'entity', url: 'orange' } },
        { label: 'Bacon',  link: { type: 'url',    url: 'http://bacon.com' } }
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
