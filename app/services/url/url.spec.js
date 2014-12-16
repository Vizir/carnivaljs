describe('On urlParams service', function () {

  var scope, url;

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, urlParams) {
      scope = $rootScope.$new();
      url = urlParams;
    });

  });

  it('should have a default value when filters is empty', function () {
    expect(typeof url.getAllFilters()).to.be.equal('object');
  });

  it('should get and set a filter', function () {
    url.setFilter('Unforgivable Curse', 'Avada Kedavra');
    expect(url.getFilter('Unforgivable Curse')).to.be.equal('Avada Kedavra');
  });

  it('should get all filters', function () {
    url.setFilter('Unforgivable Curse 1', 'Avada Kedavra');
    url.setFilter('Unforgivable Curse 2', 'Crucio');
    url.setFilter('Unforgivable Curse 3', 'Imperio');
    expect(url.getAllFilters()['Unforgivable Curse 1']).to.be.equal('Avada Kedavra');
    expect(url.getAllFilters()['Unforgivable Curse 2']).to.be.equal('Crucio');
    expect(url.getAllFilters()['Unforgivable Curse 3']).to.be.equal('Imperio');
  });

  it('should clear filters', function () {
    url.setFilter('Unforgivable Curse', 'Avada Kedavra');
    url.clearFilters();
    expect(url.getFilter('Unforgivable Curse')).to.be.equal(undefined);
  });

});
