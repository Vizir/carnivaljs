describe('On urlParams service', function () {

  var scope, url;

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, urlParams) {
      scope = $rootScope.$new();
      url = urlParams;
    });

  });

  it('should get and set a filter', function () {
    url.setParam('Unforgivable Curse', 'Avada Kedavra');
    expect(url.getParam('Unforgivable Curse')).to.be.equal('Avada Kedavra');
  });

  it('should get all filters', function () {
    url.setParam('Unforgivable Curse 1', 'Avada Kedavra');
    url.setParam('Unforgivable Curse 2', 'Crucio');
    url.setParam('Unforgivable Curse 3', 'Imperio');
    expect(url.getAllParams()['Unforgivable Curse 1']).to.be.equal('Avada Kedavra');
    expect(url.getAllParams()['Unforgivable Curse 2']).to.be.equal('Crucio');
    expect(url.getAllParams()['Unforgivable Curse 3']).to.be.equal('Imperio');
  });

  it('should clear filters', function () {
    url.setParam('Unforgivable Curse', 'Avada Kedavra');
    url.clearParams();
    expect(url.getParam('Unforgivable Curse')).to.be.equal(undefined);
  });

});
