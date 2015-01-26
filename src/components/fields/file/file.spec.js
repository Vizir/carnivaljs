describe('On carnival-file-field component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.data = 'http://anywhere/file.jpg';
    scope.field = {
      label: 'File',
      uploader: { blabla: 'ba' },
      gallery:  { bloblo: 'bo' }
    };
    scope.editable = false;
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-file-field data="data" field="field" editable="editable"></carnival-file-field>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render an img if the file is an image', function () {
    expect(element.html()).to.contain('<img');
  });

  it('should not render an img if the file is not an image', function () {
    element.isolateScope().data = 'http://anywhere/file.txt';
    scope.$digest();
    expect(element.html()).to.not.contain('<img');
  });

  it('should render an field if the content is editable', function () {
    element.isolateScope().editable = true;
    scope.$digest();
    expect(element.html()).to.contain('<input');
    expect(element.html()).to.contain('type="text"');
  });

  it('should render the uploader if it have an uploader', function () {
    element.isolateScope().editable = true;
    scope.$digest();
    expect(element.html()).to.contain('Upload');
  });

  it('should render the uploader if it have a gallery', function () {
    element.isolateScope().editable = true;
    scope.$digest();
    expect(element.html()).to.contain('Open Gallery');
  });

});
