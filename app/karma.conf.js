module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['chai', 'mocha'],
    files: [
      // Carnival
      'bower_components/angular/angular.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/carnival.js',
      // Tests
      'app/**/*.spec.js',
      'app/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      '**/*.html': 'ng-html2js'
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
