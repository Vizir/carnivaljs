describe("On Configuration Models", function() {

  var configuration, configurationProvider;

  beforeEach(function () {
    module('carnival');

    angular.module('carnival').config(function (ConfigurationProvider) {
      configurationProvider = ConfigurationProvider;
    });

    inject(function(Configuration) {
      configuration = Configuration;
    });

  });

  it('should get/set the base api url', function () {
    configurationProvider.setBaseApiUrl('http://dogs.org/woof/');
    expect(configuration.getBaseApiUrl()).to.be.equal('http://dogs.org/woof/');
  });

  it('should get/set the application name', function () {
    configurationProvider.setAppName('Dogs Store');
    expect(configuration.getAppName()).to.be.equal('Dogs Store');
  });

  it('should add/get a entity', function () {
    configurationProvider.addEntity('cat', { saySomething: 'Enemy!' });
    expect(configuration.getEntity('cat').options.saySomething).to.be.equals('Enemy!');
  });

  it('should return all entities', function () {
    configurationProvider.addEntity('dog', { saySomething: 'woof!' });
    configurationProvider.addEntity('cat', { saySomething: 'Enemy!' });
    expect(configuration.getEntities().length).to.be.equal(2);
  });

});
