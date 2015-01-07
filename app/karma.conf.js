module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['chai', 'mocha', 'sinon'],
    files: [
      // Carnival
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-loading-bar/build/*.js',
      'bower_components/angular-translate/*.js',
      'dist/tmp/*.js',
      'app/carnival.js',
      'app/**/!(*spec).js',
      // Tests
      'bower_components/angular-mocks/angular-mocks.js',
      // Specs
      'app/**/*.spec.js',
      'app/*.spec.js'
    ],
    exclude: [],
    preprocessors: {'app/**/!(*spec).js': ['coverage']},
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
