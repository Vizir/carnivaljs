describe('On carnival-listing-extra-action component', function () {
  var element, scope, compile, Configuration;

  beforeEach(function () {
    module('carnival');
    inject(function ($rootScope, $compile, _Configuration_) {
      scope = $rootScope.$new();
      compile = $compile;
      Configuration = _Configuration_;
    });

  });

  describe('when the link has params', function(){
    beforeEach(function(){
      scope.item = {
        id: 100
      };
      scope.extraAction = {
        name: 'actionName',
        label: 'actionName',
        url: '/action/:id',
        action: function () {
        }
      };
      element = angular.element('<carnival-listing-extra-action item="item" extra-action="extraAction" ></carnival-listing-field>');
      compile(element)(scope);
      scope.$digest();
    });
    
    it('should render the url correctly', function(){
      expect(element.html()).to.contain(100);
      expect(element.html()).to.contain('actionName');
    });

    it('should execute the action correctly', function () {
      var x = 1;
      element.isolateScope().extraAction.action = function () {
        x = 2;
      };
      scope.$digest();
      element.isolateScope().executeAction();
      expect(x).to.be.equal(2);
    });

  });

});
