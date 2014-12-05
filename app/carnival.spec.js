describe('Midway: Test Modules', function () {

  describe('Carnival Modules:', function () {

    var module = angular.module('carnival'),
        dependencies = module.requires;

    it('should be registered', function () {
      expect(module).to.exist();
    });

    describe('Dependencies:', function () {

      it('should have carnival.models', function () {
        expect(dependencies).to.include('carnival.models');
      });

      it('should have carnival.services', function () {
        expect(dependencies).to.include('carnival.services');
      });

      it('should have carnival.directives', function () {
        expect(dependencies).to.include('carnival.directives');
      });

      it('should have carnival.controllers', function () {
        expect(dependencies).to.include('carnival.controllers');
      });

      it('should have ui.router', function () {
        expect(dependencies).to.include('ui.router');
      });

      it('should have templates-dist', function () {
        expect(dependencies).to.include('templates-dist');
      });

    });

    describe('Routes:', function () {

    });

  });

});
