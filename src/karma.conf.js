module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['chai', 'mocha', 'sinon'],
    files: [
      // Carnival
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/textAngular/src/textAngular.js',
      'bower_components/textAngular/src/textAngular-sanitize.js',
      'bower_components/textAngular/src/textAngularSetup.js',
      'bower_components/angular-loading-bar/build/*.js',
      'bower_components/angular-translate/*.js',
      'bower_components/angular-datepicker/dist/index.js',
      'bower_components/string-mask/src/string-mask.js',
      'dist/tmp/*.js',
      'src/carnival.js',
      'src/**/!(*spec).js',
      // Tests
      'bower_components/angular-mocks/angular-mocks.js',
      // Specs
      'src/**/*.spec.js',
      'src/*.spec.js'
    ],
    exclude: [],
    preprocessors: {'src/**/!(*spec).js': ['coverage']},
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false,
    coverageReporter: {
      type : 'text'
    }
  });
};
