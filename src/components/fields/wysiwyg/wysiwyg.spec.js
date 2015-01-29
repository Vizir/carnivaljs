describe('On carnival-wysiwyg component', function () {
  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.label = 'Answer to the Ultimate Question of Life, the Universe, and Everything';
    scope.data = 'Forty-Two';
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile, $document) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-wysiwyg-field label="label" data="data"></carnival-wysiwyg-field>');
    compile(element)(scope);
    scope.$apply();

  });

  // TODO - ADJUST TEST

});
