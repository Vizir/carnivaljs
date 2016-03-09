module.exports = {
  dist: {
    options: {
      banner: '/* CARNIVAL.JS */\n(function () {\n"use strict";\n',
      footer: '})().bind(window);'
    },
    src: [
      'src/**/*.js',
      '!src/**/*.spec.js',
      '!src/karma.conf.js',
      'build/tmp/*.js',
      'bower_components/sweetalert/lib/sweet-alert.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ng-wig/dist/ng-wig.js',
      'bower_components/angular-scroll/angular-scroll.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-datepicker/dist/angular-datepicker.js',
      'bower_components/string-mask/src/string-mask.js'
    ],
    dest: 'build/carnival.js'
  },

  css: {
    src: [
      'src/styles/*.css',
      'bower_components/sweetalert/lib/sweet-alert.css',
      'bower_components/ng-wig/dist/css/ng-wig.css',
      'bower_components/angular-datepicker/dist/angular-datepicker.css'
    ],
    dest: 'build/carnival.css'
  }
};
