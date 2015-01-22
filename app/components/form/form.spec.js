describe('On carnival-form component', function () {
  var compile, element, scope, isolateScope;

  //Need to create a cross browser click() function no .click() in PhantomJS
  function click(el){
      var ev = document.createEvent('MouseEvent');
      ev.initMouseEvent(
          'click',
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0, /* coordinates */
          false, false, false, false, /* modifier keys */
          0 /*left*/, null
      );
      el.dispatchEvent(ev);
  }

  var setScopeData = function (scope) {
    scope.fields = [
      { name: 'food', label: 'Food' },
      { name: 'taste', label: 'Taste' }
    ];
    scope.datas = { food: 'Lasagna', taste: 'Good' };
    scope.action = { label: 'Engravin', click: function () {} };
  };

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });

    setScopeData(scope);

    element = angular.element('<carnival-form fields="fields" datas="datas" action="action"></carnival-delete-button>');
    compile(element)(scope);
    scope.$digest();

    isolateScope = element.isolateScope();

  });

  it('should render form labels from fields', function () {
    expect(element.html())
    .to.contain('Food')
    .to.contain('Taste');
  });

  it('should get form content from datas', function () {
    expect(isolateScope.datas)
    .to.not.be.null();
  });

  it('should create an action button', function () {
    expect(element.html())
    .to.contain('Engravin');
  });



});
