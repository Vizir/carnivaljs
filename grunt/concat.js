module.exports = {
  dist: {
    options: {
      banner: '/* CARNIVAL.JS */\n(function () {\n"use strict";\n',
      footer: '})();'
    },
    src: [
      'src/**/*.js',
      '!src/**/*.spec.js',
      '!src/karma.conf.js',
      'build/tmp/*.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ng-wig/dist/ng-wig.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-datepicker/dist/index.js',
      'bower_components/string-mask/src/string-mask.js'
    ],
    dest: 'build/carnival.js'
  },

  css: {
    src: [
      'src/styles/carnival.css',
      'bower_components/ng-wig/dist/css/ng-wig.css',
      'bower_components/angular-datepicker/dist/index.css'
    ],
    dest: 'build/carnival.css'
  }
};
