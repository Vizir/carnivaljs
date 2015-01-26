describe('On notification service', function () {

  var scope, Notification, notificationFactory, $timeout;

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, _Notification_, _notificationFactory_, _$timeout_) {
      scope = $rootScope.$new();
      Notification = _Notification_;
      notificationFactory = _notificationFactory_;
      $timeout = _$timeout_;
    });

  });

  it('should add notifications to factory', function () {
    new Notification('Mario', 'error');
    new Notification('Luigi', 'success');
    expect(notificationFactory.length).to.be.equal(2);
  });

  it('should remove notifications after timeout', function () {
    new Notification('Mario', 'error');
    $timeout.flush();
    expect(notificationFactory.length).to.be.equal(0);
  });

});
