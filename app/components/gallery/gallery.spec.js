describe('On carnival-gallery component', function () {

  var compile, element, scope;

  var setScopeData = function (scope) {
    scope.data = 'What does the fox says?';
    scope.gallery = {
      url: 'Fooo'
    };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-gallery gallery="gallery" file-url="data"></carnival-gallery>');
    compile(element)(scope);
    scope.$digest();

  });

  it('should render an button to open the gallery', function () {
    expect(element.html()).to.contain('Open Gallery');
  });

  it('should update the data value using the sendUrl function', function () {
    window.CARNIVAL.gallery.sendUrl('Ahoooo!');
    expect(element.isolateScope().fileUrl).to.be.equal('Ahoooo!');
  });

});
