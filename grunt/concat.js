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
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-datepicker/dist/index.js',
      'bower_components/string-mask/src/string-mask.js'
    ],
    dest: 'build/carnival.js'
  },

  css: {
    src: [
      'styles/carnival.css',
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'bower_components/font-awesome/css/font-awesome.css',
      'bower_components/angular-datepicker/dist/index.css'
    ],
    dest: 'build/carnival.css'
  }
};