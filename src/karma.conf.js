module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['chai', 'mocha', 'sinon'],
    files: [
      // Carnival
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ng-wig/dist/ng-wig.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-scroll/angular-scroll.js',
      'bower_components/angular-datepicker/dist/angular-datepicker.js',
      'bower_components/string-mask/src/string-mask.js',
      'bower_components/sweetalert/lib/sweet-alert.js',
      'build/tmp/*.js',
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
