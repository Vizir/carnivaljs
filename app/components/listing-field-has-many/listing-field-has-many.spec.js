describe('On listing-field-has-many component', function () {
  var compile, element, scope, Configuration;

  var setScopeData = function (scope) {
    scope.item = {
      id: '1'
    };
    scope.field = {
      endpoint: 'comments',
      name: 'comments',
      entityName: 'comments'
    };
  };

  var commentEntity = {
    fields: [
      {
        name: 'post',
        entityName: 'posts',
        type: 'belongsTo',
        foreignKey: 'postId'
      }
    ]
  };

  var postEntity = {
    identifier: 'id',
    name: 'posts'
  };

  var $stateParams = {
    entity: 'cats'
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile, _Configuration_) {
      scope = $rootScope.$new();
      compile = $compile;
      Configuration = _Configuration_;
    });

    setScopeData(scope);

    sinon.stub(Configuration, 'getEntity', function(entityName){
      if(entityName === 'comments')
        return commentEntity;
      else
        return postEntity;
    });

    element = angular.element('<carnival-listing-field-has-many item="item" field="field"></carnival-listing-field-has-many');


    compile(element)(scope);
    scope.$digest();

  });

  it('should render a link', function () {
    expect(element.html()).to.contain('#/list/comments');
  });

  it('should render the link with a search filter', function () {
    expect(element.html()).to.contain('search');
    expect(element.html()).to.contain('post');
  });

});
