describe('On uploader service', function () {

  var scope, Uploader, $httpBackend;

  beforeEach(function () {

    module('carnival');
    inject(function ($rootScope, _Uploader_, _$httpBackend_) {
      scope = $rootScope.$new();
      Uploader = _Uploader_;
      $httpBackend = _$httpBackend_;
    });

    $httpBackend.expectPOST('http://somewhere/upload').respond();

  });

  it('should request an upload a file to an endpoint', function () {
    expect(Uploader.upload('http://somewhere/upload', 'file')).to.not.be.equal(undefined);

  });

});
