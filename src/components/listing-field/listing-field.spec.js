describe('On carnival-listing-field component', function () {
  var element, scope, compile;

  beforeEach(function () {
    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  });

  describe("when is a simple field", function(){
    var setScopeData = function(scope){
      scope.field = { name: 'title'};
      scope.item = { title: 'Title' };
    };

    beforeEach(function(){
      setScopeData(scope);
      element = angular.element('<carnival-listing-field item="item" field="field"></carnival-listing-field>');
      compile(element)(scope);
      scope.$digest();
    });

    it('should render the field', function(){
      expect(element.html())
      .to.contain('Title');
    });
  });


  describe("when is a belongsTo field", function(){
    var setScopeData = function(scope){
      scope.field = {
        name: 'post',
        type: 'belongsTo',
        endpoint: 'posts',
        field: 'title',
        views: {
          index: {
            enable: true
          }
        }
      };
      scope.item = {
        comment: 'The book is on the table',
        post: {
          title: 'Book'
        }
      };
    };

    beforeEach(function(){
      setScopeData(scope);
      element = angular.element('<carnival-listing-field item="item" field="field"></carnival-listing-field>');
      compile(element)(scope);
      scope.$digest();
    });

    it('should render the field', function(){
      expect(element.html())
      .to.contain('Book');
    });
  });
});
