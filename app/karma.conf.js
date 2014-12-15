module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['chai', 'mocha'],
    files: [
      // Carnival
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'dist/carnival.js',
      // Tests
      'bower_components/angular-mocks/angular-mocks.js',
      // Specs
      'app/**/*.spec.js',
      'app/*.spec.js'
    ],
    exclude: [],
    preprocessors: {'dist/carnival.js': ['coverage']},
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
