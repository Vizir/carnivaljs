describe('Midway: Test Modules', function () {

  describe('Carnival Modules:', function () {

    var module = angular.module('carnival'),
        dependencies = module.requires;

    it('should be registered', function () {
      expect(module).not.toEqual(null);
    });

    describe('Dependencies:', function () {

      it('should have carnival.models', function () {
        expect(dependencies.indexOf('carnival.models') >= 0).toEqual(true);
      });

      it('should have carnival.services', function () {
        expect(dependencies.indexOf('carnival.services') >= 0).toEqual(true);
      });

      it('should have carnival.directives', function () {
        expect(dependencies.indexOf('carnival.directives') >= 0).toEqual(true);
      });

      it('should have carnival.controllers', function () {
        expect(dependencies.indexOf('carnival.controllers') >= 0).toEqual(true);
      });

      it('should have ui.router', function () {
        expect(dependencies.indexOf('ui.router') >= 0).toEqual(true);
      });

      it('should have templates-dist', function () {
        expect(dependencies.indexOf('templates-dist') >= 0).toEqual(true);
      });

    });

    describe('Routes:', function () {
      
    });

  });

});