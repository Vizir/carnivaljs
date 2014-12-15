describe('On carnival-listing-field-belongs-to component', function () {
  var element, scope, compile; 

  beforeEach(function () {
    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  });

  describe("when has a url", function(){
    var setScopeData = function(scope){
      scope.field = { 
        name: 'post', 
        type: 'belongsTo', 
        resourceName: 'posts',
        views: {
          index: {
            enable: true,
            label: 'title'
          }
        }
      };
      scope.item = { 
        comment: 'The book is on the table',
        postUrl: 'http://has.a.url',
        post: {
          title: 'Book' 
        }
      };
    };
    
    beforeEach(function(){
      setScopeData(scope);
      element = angular.element('<carnival-listing-field-belongs-to item="item" field="field"></carnival-listing-field>');
      compile(element)(scope);
      scope.$digest();
    });

    it('should render the the link with the url', function(){
      expect(element.html())
      .to.contain('has.a.url');
    });
  });

  describe("when not has a url", function(){
    var setScopeData = function(scope){
      scope.field = { 
        name: 'post', 
        type: 'belongsTo', 
        resourceName: 'posts',
        views: {
          index: {
            enable: true,
            label: 'title'
          }
        }
      };
      scope.item = { 
        comment: 'The book is on the table',
        post: {
          title: 'Book',
          id: 1
        }
      };
    };
    
    beforeEach(function(){
      setScopeData(scope);
      element = angular.element('<carnival-listing-field-belongs-to item="item" field="field"></carnival-listing-field>');
      compile(element)(scope);
      scope.$digest();
    });

    it('should render the the link with REST url', function(){
      expect(element.html())
      .to.contain('posts/1');
    });
  });

});
